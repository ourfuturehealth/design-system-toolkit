#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'EOF' >&2
Usage: publish-auto-release.sh --package <toolkit|react-components> --tag <tag> --target <sha> --expected-version <version> [--stage-dir <dir>] [--test-release] [--keep-test-release]
EOF
}

current_step='initializing auto-release publishing'
package=''
tag=''
target=''
expected_version=''
stage_dir=''
test_release=false
keep_test_release=false
tag_created=false

on_error() {
  printf 'Auto-release publishing failed while %s.\n' "${current_step}" >&2
}

is_safe_test_tag() {
  [[ "${tag}" == auto-release-test-* ]]
}

cleanup_test_release() {
  if [[ "${test_release}" != true || "${keep_test_release}" == true ]]; then
    return
  fi

  if ! is_safe_test_tag; then
    printf 'Refusing to clean up non-test tag: %s\n' "${tag}" >&2
    return
  fi

  printf 'Cleaning up dry-run release %s\n' "${tag}"
  gh release delete "${tag}" --repo "${GITHUB_REPOSITORY}" --yes --cleanup-tag >/dev/null 2>&1 || true

  if [[ "${tag_created}" == true ]]; then
    git push origin ":refs/tags/${tag}" >/dev/null 2>&1 || true
  fi
}

trap on_error ERR
trap cleanup_test_release EXIT

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
    --target)
      target="$2"
      shift 2
      ;;
    --expected-version)
      expected_version="$2"
      shift 2
      ;;
    --stage-dir)
      stage_dir="$2"
      shift 2
      ;;
    --test-release)
      test_release=true
      shift
      ;;
    --keep-test-release)
      keep_test_release=true
      shift
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

if [[ -z "${package}" || -z "${tag}" || -z "${target}" || -z "${expected_version}" ]]; then
  usage
  exit 1
fi

case "${package}" in
  toolkit|react-components)
    ;;
  *)
    echo "Unsupported package: ${package}" >&2
    exit 1
    ;;
esac

repo_root=$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)
cd "${repo_root}"

if [[ "${test_release}" == true && "${keep_test_release}" != true && ! "${tag}" == auto-release-test-* ]]; then
  echo "Dry-run releases must use an auto-release-test-* tag." >&2
  exit 1
fi

if [[ -z "${stage_dir}" ]]; then
  stage_dir=$(mktemp -d "${RUNNER_TEMP:-${TMPDIR:-/tmp}}/ofh-auto-release.${package}.XXXXXX")
fi

mkdir -p "${stage_dir}"
metadata_file=$(mktemp)
notes_path=$(mktemp)

current_step="checking whether ${tag} already exists"
if git ls-remote --exit-code --tags origin "refs/tags/${tag}" >/dev/null 2>&1; then
  echo "Remote tag ${tag} already exists. Auto-release will not overwrite existing tags." >&2
  exit 1
fi

if gh release view "${tag}" --repo "${GITHUB_REPOSITORY}" >/dev/null 2>&1; then
  echo "GitHub release ${tag} already exists. Auto-release will not overwrite existing releases." >&2
  exit 1
fi

current_step="preparing ${package} release assets"
"${repo_root}/scripts/release/prepare-release-artifacts.sh" \
  "${package}" \
  --stage-dir "${stage_dir}" \
  --metadata-file "${metadata_file}"
# shellcheck disable=SC1090
source "${metadata_file}"

if [[ "${VERSION}" != "${expected_version}" ]]; then
  echo "Expected ${package} version ${expected_version}, but prepared ${VERSION}." >&2
  exit 1
fi

current_step="smoke testing ${package} release tarball"
"${repo_root}/scripts/release/smoke-package-tarball.sh" \
  --package-dir "${PACKAGE_DIR}" \
  --tarball "${TARBALL_PATH}" \
  --managers 'yarn,npm,pnpm'

current_step="rendering ${package} release notes"
if [[ "${package}" == 'toolkit' ]]; then
  "${repo_root}/scripts/release/render-release-notes.sh" \
    --package "${package}" \
    --tag "${tag}" \
    --version "${VERSION}" \
    --tarball "${TARBALL_NAME}" \
    --zip "${ZIP_NAME}" > "${notes_path}"
else
  "${repo_root}/scripts/release/render-release-notes.sh" \
    --package "${package}" \
    --tag "${tag}" \
    --version "${VERSION}" \
    --tarball "${TARBALL_NAME}" > "${notes_path}"
fi

current_step="creating annotated tag ${tag}"
git tag -a "${tag}" "${target}" -m "Release ${package} v${VERSION}"
git push origin "refs/tags/${tag}"
tag_created=true

current_step="creating GitHub release ${tag}"
release_flags=()
if [[ "${test_release}" == true ]]; then
  release_flags+=(--draft --prerelease)
fi

gh release create "${tag}" \
  --repo "${GITHUB_REPOSITORY}" \
  --target "${target}" \
  --title "${tag}" \
  --notes-file "${notes_path}" \
  --verify-tag \
  "${release_flags[@]}"

current_step="uploading GitHub release assets for ${tag}"
if [[ "${package}" == 'toolkit' ]]; then
  gh release upload "${tag}" "${ZIP_PATH}" "${TARBALL_PATH}" --repo "${GITHUB_REPOSITORY}"
  expected_assets=("${ZIP_NAME}" "${TARBALL_NAME}")
else
  gh release upload "${tag}" "${TARBALL_PATH}" --repo "${GITHUB_REPOSITORY}"
  expected_assets=("${TARBALL_NAME}")
fi

current_step="verifying GitHub release assets for ${tag}"
asset_names=$(gh release view "${tag}" --repo "${GITHUB_REPOSITORY}" --json assets --jq '.assets[].name')
for asset in "${expected_assets[@]}"; do
  if ! grep -Fxq "${asset}" <<< "${asset_names}"; then
    echo "Missing expected release asset ${asset} on ${tag}." >&2
    exit 1
  fi
done

printf 'Published %s release %s with assets:\n' "${package}" "${tag}"
printf '  %s\n' "${expected_assets[@]}"
