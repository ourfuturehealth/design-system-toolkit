#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'EOF' >&2
Usage: smoke-current-release-artifacts.sh [toolkit|react-components|all] [--managers yarn,npm,pnpm]
EOF
}

current_step='initializing smoke-current-release-artifacts'

print_step() {
  printf ' -> %s\n' "$1"
}

print_success() {
  printf ' ✓ %s\n' "$1"
}

run_quiet_step() {
  local description=$1
  shift

  local log_file
  log_file=$(mktemp)
  cleanup_files+=("${log_file}")

  if "$@" >"${log_file}" 2>&1; then
    return 0
  fi

  printf '\n✗ %s\n' "${description}" >&2
  cat "${log_file}" >&2
  return 1
}

on_error() {
  printf 'Smoke testing current release artifacts failed while %s.\n' "${current_step}" >&2
}

trap on_error ERR

repo_root=$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)
cd "${repo_root}"

package_scope='all'
managers='yarn,npm,pnpm'

while [[ $# -gt 0 ]]; do
  case "$1" in
    toolkit|react-components|all)
      package_scope="$1"
      shift
      ;;
    --managers)
      managers="$2"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      usage
      exit 1
      ;;
  esac
done

cleanup_files=()

cleanup() {
  if [[ ${#cleanup_files[@]} -gt 0 ]]; then
    rm -f "${cleanup_files[@]}"
  fi
}

trap cleanup EXIT

print_summary() {
  local package_name=$1
  printf '\n==> Smoke testing current %s release artifact\n' "${package_name}"
  printf '    package managers: %s\n' "${managers}"
}

if [[ "${package_scope}" == 'toolkit' || "${package_scope}" == 'all' ]]; then
  print_summary 'toolkit'
  current_step='building toolkit release artifacts'
  print_step 'Building toolkit compiled artifacts with pnpm'
  run_quiet_step \
    'Building toolkit compiled artifacts failed' \
    pnpm --filter=@ourfuturehealth/toolkit run zip
  print_success 'Built toolkit compiled artifacts'

  current_step='packing toolkit tarball'
  print_step 'Packing toolkit tarball with npm pack'
  toolkit_tarball=$(npm pack ./packages/toolkit --ignore-scripts | tail -n 1)
  print_success "Created toolkit tarball ${toolkit_tarball}"
  cleanup_files+=("${toolkit_tarball}")

  current_step='smoke testing toolkit tarball'
  print_step "Running toolkit tarball smoke test against ${managers}"
  "${repo_root}/scripts/release/smoke-package-tarball.sh" \
    --package-dir "${repo_root}/packages/toolkit" \
    --tarball "${repo_root}/${toolkit_tarball}" \
    --managers "${managers}"
  print_success 'Toolkit tarball smoke test passed'
fi

if [[ "${package_scope}" == 'react-components' || "${package_scope}" == 'all' ]]; then
  print_summary 'react-components'
  current_step='building react-components release artifacts'
  print_step 'Building react-components library with pnpm'
  run_quiet_step \
    'Building react-components release artifacts failed' \
    pnpm --filter=@ourfuturehealth/react-components run build
  print_success 'Built react-components library'

  current_step='packing react-components tarball'
  print_step 'Packing react-components tarball with npm pack'
  react_tarball=$(npm pack ./packages/react-components --ignore-scripts | tail -n 1)
  print_success "Created react-components tarball ${react_tarball}"
  cleanup_files+=("${react_tarball}")

  current_step='smoke testing react-components tarball'
  print_step "Running react-components tarball smoke test against ${managers}"
  "${repo_root}/scripts/release/smoke-package-tarball.sh" \
    --package-dir "${repo_root}/packages/react-components" \
    --tarball "${repo_root}/${react_tarball}" \
    --managers "${managers}"
  print_success 'React-components tarball smoke test passed'
fi

current_step='printing success summary'
printf '\nSmoke testing completed successfully for scope "%s".\n' "${package_scope}"
