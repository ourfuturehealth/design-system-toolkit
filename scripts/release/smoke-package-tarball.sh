#!/usr/bin/env bash

set -euo pipefail

current_step='initializing tarball smoke test'

print_step() {
  printf ' -> %s\n' "$1"
}

print_success() {
  printf ' ✓ %s\n' "$1"
}

on_error() {
  printf 'Tarball smoke test failed while %s.\n' "${current_step}" >&2
  if [[ -n "${server_log:-}" && -f "${server_log}" ]]; then
    printf 'HTTP server log:\n' >&2
    cat "${server_log}" >&2
  fi
}

trap on_error ERR

usage() {
  cat <<'EOF' >&2
Usage: smoke-package-tarball.sh --package-dir <dir> --tarball <file> [--managers yarn,npm,pnpm]
EOF
}

package_dir=''
tarball=''
managers='yarn,npm,pnpm'

while [[ $# -gt 0 ]]; do
  case "$1" in
    --package-dir)
      package_dir="$2"
      shift 2
      ;;
    --tarball)
      tarball="$2"
      shift 2
      ;;
    --managers)
      managers="$2"
      shift 2
      ;;
    *)
      usage
      exit 1
      ;;
  esac
done

if [[ -z "$package_dir" || -z "$tarball" ]]; then
  usage
  exit 1
fi

package_dir=$(cd "$package_dir" && pwd)
tarball=$(cd "$(dirname "$tarball")" && pwd)/$(basename "$tarball")

current_step='reading package metadata'
package_name=$(node -p "require(process.argv[1]).name" "${package_dir}/package.json")
package_version=$(node -p "require(process.argv[1]).version" "${package_dir}/package.json")

case "$package_name" in
  @ourfuturehealth/toolkit|@ourfuturehealth/react-components)
    ;;
  *)
    echo "Unsupported package name: ${package_name}" >&2
    exit 1
    ;;
esac

if ! command -v python3 >/dev/null 2>&1; then
  echo 'python3 is required to serve tarballs during smoke tests.' >&2
  exit 1
fi

current_step='allocating local HTTP server port'
port=$(python3 - <<'PY'
import socket
s = socket.socket()
s.bind(('127.0.0.1', 0))
print(s.getsockname()[1])
s.close()
PY
)

server_log=$(mktemp)
consumer_dirs=()
python3 -m http.server "${port}" --bind 127.0.0.1 --directory "$(dirname "${tarball}")" >"${server_log}" 2>&1 &
server_pid=$!

cleanup() {
  if kill -0 "${server_pid}" >/dev/null 2>&1; then
    kill "${server_pid}" >/dev/null 2>&1 || true
    wait "${server_pid}" 2>/dev/null || true
  fi
  if [[ ${#consumer_dirs[@]} -gt 0 ]]; then
    rm -rf "${consumer_dirs[@]}"
  fi
  rm -f "${server_log}"
}

trap cleanup EXIT

artifact_url="http://127.0.0.1:${port}/$(basename "${tarball}")"
print_step "Preparing smoke test for ${package_name}@${package_version}"
print_success "Serving local tarball from ${artifact_url}"

run_yarn_add() {
  local install_dir=$1
  shift
  (
    cd "${install_dir}"
    npx -y yarn@1.22.22 add --ignore-scripts "$@"
  )
}

create_consumer_dir() {
  local install_dir
  install_dir=$(mktemp -d)
  cat >"${install_dir}/package.json" <<'EOF'
{
  "name": "release-artifact-smoke",
  "private": true
}
EOF
  consumer_dirs+=("${install_dir}")
  echo "${install_dir}"
}

toolkit_resolution_check() {
  local install_dir=$1
  (
    cd "${install_dir}"
    node - <<'NODE'
const fs = require('fs');
const path = require('path');

const polyfills = require.resolve('@ourfuturehealth/toolkit/polyfills');
const card = require.resolve('@ourfuturehealth/toolkit/components/card/card');
const common = require.resolve('@ourfuturehealth/toolkit/common');
const macroPath = path.join(process.cwd(), 'node_modules', '@ourfuturehealth', 'toolkit', 'components', 'card', 'macro.njk');

if (!fs.existsSync(macroPath)) {
  throw new Error(`Expected toolkit template macro at ${macroPath}`);
}
NODE
  )
}

toolkit_bundle_check() {
  local install_dir=$1
  local js_body=$2
  local scss_body=$3

  cat >"${install_dir}/application.js" <<EOF
${js_body}
EOF

  cat >"${install_dir}/application.sass.scss" <<EOF
${scss_body}
EOF

  (
    cd "${install_dir}"
    npx esbuild application.js --bundle --outfile=out.js >/dev/null
    npx sass application.sass.scss out.css --load-path=node_modules >/dev/null
    test -f out.js
    test -f out.css
  )
}

smoke_toolkit() {
  local manager=$1
  local install_dir
  install_dir=$(create_consumer_dir)

  local deps=(
    "${package_name}@${artifact_url}"
    'sass@1.98.0'
    'esbuild@0.27.4'
  )

  case "${manager}" in
    yarn)
      run_yarn_add "${install_dir}" "${deps[@]}" >/dev/null
      ;;
    npm)
      (
        cd "${install_dir}"
        npm install --ignore-scripts "${deps[@]}" >/dev/null
      )
      ;;
    pnpm)
      (
        cd "${install_dir}"
        pnpm add --ignore-scripts "${deps[@]}" >/dev/null
      )
      ;;
    *)
      echo "Unsupported package manager: ${manager}" >&2
      exit 1
      ;;
  esac

  toolkit_resolution_check "${install_dir}"
  toolkit_bundle_check "${install_dir}" \
    "import Card from '@ourfuturehealth/toolkit/components/card/card';
import Checkboxes from '@ourfuturehealth/toolkit/components/checkboxes/checkboxes';
import Details from '@ourfuturehealth/toolkit/components/details/details';
import MenuToggle from '@ourfuturehealth/toolkit/components/header/menuToggle';
import Radios from '@ourfuturehealth/toolkit/components/radios/radios';
import LinkSkip from '@ourfuturehealth/toolkit/components/link-skip/link-skip';
import '@ourfuturehealth/toolkit/polyfills';
console.log(Boolean(Card && Checkboxes && Details && MenuToggle && Radios && LinkSkip));" \
    "@import '@ourfuturehealth/toolkit/ofh';
body { color: red; }"
}

smoke_react() {
  local manager=$1
  local install_dir
  install_dir=$(create_consumer_dir)

  local peer_specs=()
  while IFS= read -r peer_spec; do
    if [[ -n "${peer_spec}" ]]; then
      peer_specs+=("${peer_spec}")
    fi
  done < <(
    node - <<'NODE' "${package_dir}/package.json"
const pkg = require(process.argv[2]);
for (const [name, range] of Object.entries(pkg.peerDependencies || {})) {
  console.log(`${name}@${range}`);
}
NODE
  )

  local deps=("${peer_specs[@]}" "${package_name}@${artifact_url}")

  case "${manager}" in
    yarn)
      run_yarn_add "${install_dir}" "${deps[@]}" >/dev/null
      ;;
    npm)
      (
        cd "${install_dir}"
        npm install --ignore-scripts "${deps[@]}" >/dev/null
      )
      ;;
    pnpm)
      (
        cd "${install_dir}"
        pnpm add --ignore-scripts "${deps[@]}" >/dev/null
      )
      ;;
    *)
      echo "Unsupported package manager: ${manager}" >&2
      exit 1
      ;;
  esac

  (
    cd "${install_dir}"
    node - <<'NODE'
const React = require('react');
const packageEntry = require.resolve('@ourfuturehealth/react-components');
const stylesEntry = require.resolve('@ourfuturehealth/react-components/styles');

if (!packageEntry || !stylesEntry) {
  throw new Error('Expected package and styles entrypoints to resolve');
}

(async () => {
  const { Button } = await import('@ourfuturehealth/react-components');

  if (typeof Button !== 'function' && typeof Button !== 'object') {
    throw new Error('Expected Button export to be available from @ourfuturehealth/react-components');
  }

  const buttonElement = React.createElement(Button, { variant: 'contained' }, 'Continue');

  if (!buttonElement || buttonElement.type !== Button) {
    throw new Error('Expected Button import to create a React element');
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
NODE
  )
}

IFS=',' read -r -a manager_list <<< "${managers}"

for manager in "${manager_list[@]}"; do
  current_step="installing ${package_name}@${package_version} with ${manager}"
  printf '\n==> Smoke testing %s@%s with %s\n' "${package_name}" "${package_version}" "${manager}"
  case "${package_name}" in
    @ourfuturehealth/toolkit)
      print_step "Installing toolkit tarball and smoke-test helpers with ${manager}"
      smoke_toolkit "${manager}"
      print_success "Toolkit tarball passed resolution, bundling, and Sass checks with ${manager}"
      ;;
    @ourfuturehealth/react-components)
      print_step "Installing react-components tarball and peer dependencies with ${manager}"
      smoke_react "${manager}"
      print_success "React tarball passed export and component rendering checks with ${manager}"
      ;;
  esac
done

current_step='printing tarball smoke success summary'
printf '\nTarball smoke test passed for %s@%s.\n' "${package_name}" "${package_version}"
