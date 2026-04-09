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
cleanup_dirs=()

cleanup() {
  if [[ ${#cleanup_files[@]} -gt 0 ]]; then
    rm -f "${cleanup_files[@]}"
  fi

  if [[ ${#cleanup_dirs[@]} -gt 0 ]]; then
    rm -rf "${cleanup_dirs[@]}"
  fi
}

trap cleanup EXIT

print_summary() {
  local package_name=$1
  printf '\n==> Smoke testing current %s release artifact\n' "${package_name}"
  printf '    package managers: %s\n' "${managers}"
}

load_prepared_artifacts() {
  local package_name=$1
  local metadata_file
  local stage_dir

  metadata_file=$(mktemp)
  stage_dir=$(mktemp -d)
  cleanup_files+=("${metadata_file}")
  cleanup_dirs+=("${stage_dir}")

  current_step="preparing ${package_name} release artifacts"
  print_step "Preparing ${package_name} release artifacts"
  "${repo_root}/scripts/release/prepare-release-artifacts.sh" \
    "${package_name}" \
    --stage-dir "${stage_dir}" \
    --metadata-file "${metadata_file}"
  # shellcheck disable=SC1090
  source "${metadata_file}"

  if [[ -z "${PACKAGE_DIR:-}" ]]; then
    printf 'Missing required metadata variable: PACKAGE_DIR\n' >&2
    exit 1
  fi

  if [[ -z "${TARBALL_PATH:-}" ]]; then
    printf 'Missing required metadata variable: TARBALL_PATH\n' >&2
    exit 1
  fi

  print_success "Prepared ${package_name} release artifacts"
}

if [[ "${package_scope}" == 'toolkit' || "${package_scope}" == 'all' ]]; then
  print_summary 'toolkit'
  load_prepared_artifacts 'toolkit'

  current_step='smoke testing toolkit tarball'
  print_step "Running toolkit tarball smoke test against ${managers}"
  "${repo_root}/scripts/release/smoke-package-tarball.sh" \
    --package-dir "${PACKAGE_DIR}" \
    --tarball "${TARBALL_PATH}" \
    --managers "${managers}"
  print_success 'Toolkit tarball smoke test passed'
fi

if [[ "${package_scope}" == 'react-components' || "${package_scope}" == 'all' ]]; then
  print_summary 'react-components'
  load_prepared_artifacts 'react-components'

  current_step='smoke testing react-components tarball'
  print_step "Running react-components tarball smoke test against ${managers}"
  "${repo_root}/scripts/release/smoke-package-tarball.sh" \
    --package-dir "${PACKAGE_DIR}" \
    --tarball "${TARBALL_PATH}" \
    --managers "${managers}"
  print_success 'React-components tarball smoke test passed'
fi

current_step='printing success summary'
printf '\nSmoke testing completed successfully for scope "%s".\n' "${package_scope}"
