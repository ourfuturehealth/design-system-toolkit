#!/usr/bin/env bash

set -euo pipefail

current_step='initializing release note rendering'

log_step() {
  printf ' -> %s\n' "$1" >&2
}

log_success() {
  printf ' ✓ %s\n' "$1" >&2
}

on_error() {
  printf 'Release note rendering failed while %s.\n' "${current_step}" >&2
}

trap on_error ERR

usage() {
  cat <<'EOF' >&2
Usage: render-release-notes.sh --package <toolkit|react-components> --tag <tag> --version <version> --tarball <asset-name> [--zip <asset-name>]
EOF
}

package=''
tag=''
version=''
tarball=''
zip_asset=''

while [[ $# -gt 0 ]]; do
  case "$1" in
    --package)
      package="$2"
      shift 2
      ;;
    --tag)
      tag="$2"
      shift 2
      ;;
    --version)
      version="$2"
      shift 2
      ;;
    --tarball)
      tarball="$2"
      shift 2
      ;;
    --zip)
      zip_asset="$2"
      shift 2
      ;;
    *)
      usage
      exit 1
      ;;
  esac
done

if [[ -z "$package" || -z "$tag" || -z "$version" || -z "$tarball" ]]; then
  usage
  exit 1
fi

current_step='validating render arguments'
log_step "Rendering release notes for ${package} ${version} (${tag})"
log_success 'Arguments validated'

repo_url='https://github.com/ourfuturehealth/design-system-toolkit'
upgrade_guide_url="${repo_url}/blob/main/UPGRADING.md"
react_package_manifest='packages/react-components/package.json'

render_react_peer_dependencies() {
  node - <<'NODE' "${react_package_manifest}"
const fs = require('fs');
const manifestPath = process.argv[2];

if (!fs.existsSync(manifestPath)) {
  console.error(`React package manifest not found at ${manifestPath}`);
  process.exit(1);
}

const pkg = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const peerDependencies = Object.entries(pkg.peerDependencies || {});

if (peerDependencies.length === 0) {
  console.error('Expected react-components to declare peerDependencies in package.json');
  process.exit(1);
}

for (const [name, range] of peerDependencies) {
  console.log(`- \`${name}\`: \`${range}\``);
}
NODE
}

case "$package" in
  toolkit)
    if [[ -z "${zip_asset}" ]]; then
      echo 'Toolkit release notes require a compiled zip asset via --zip.' >&2
      exit 1
    fi
    current_step='emitting toolkit release notes'
    log_step "Emitting toolkit release notes with tarball ${tarball} and zip ${zip_asset}"
    cat <<EOF
Release of **toolkit** version ${version}

## Install With A Package Manager

\`\`\`json
{
  "dependencies": {
    "@ourfuturehealth/toolkit": "${repo_url}/releases/download/${tag}/${tarball}"
  }
}
\`\`\`

## Compiled Files

This release also includes \`${zip_asset}\` for consumers who only need the prebuilt CSS, JavaScript, and assets.

## Migration

- See [Upgrading Guide](${upgrade_guide_url})
EOF
    log_success 'Rendered toolkit release notes'
    ;;
  react-components)
    current_step='reading react peer dependencies'
    log_step 'Reading React peer dependencies from package manifest'
    react_peer_dependencies=$(render_react_peer_dependencies)
    log_success 'Loaded React peer dependencies'
    current_step='emitting react release notes'
    log_step "Emitting react-components release notes with tarball ${tarball}"
    cat <<EOF
Release of **react-components** version ${version}

## Install With A Package Manager

\`\`\`json
{
  "dependencies": {
    "@ourfuturehealth/react-components": "${repo_url}/releases/download/${tag}/${tarball}"
  }
}
\`\`\`

## Peer Dependencies

${react_peer_dependencies}

## Migration

- See [Upgrading Guide](${upgrade_guide_url})
EOF
    log_success 'Rendered react-components release notes'
    ;;
  *)
    echo "Unsupported package: ${package}" >&2
    exit 1
    ;;
esac
