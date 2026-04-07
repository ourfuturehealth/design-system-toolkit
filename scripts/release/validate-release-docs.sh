#!/usr/bin/env bash

set -euo pipefail

current_step='initializing docs release-contract validation'

print_step() {
  printf ' -> %s\n' "$1"
}

print_success() {
  printf ' ✓ %s\n' "$1"
}

on_error() {
  printf 'Release-contract docs validation failed while %s.\n' "${current_step}" >&2
}

trap on_error ERR

repo_root=$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)
cd "${repo_root}"

if command -v rg >/dev/null 2>&1; then
  search_fixed() {
    rg -n --fixed-strings "$1" "${@:2}"
  }

  file_contains_regex() {
    rg -q "$1" "$2"
  }
else
  search_fixed() {
    grep -nF -- "$1" "${@:2}"
  }

  file_contains_regex() {
    grep -qE -- "$1" "$2"
  }
fi

current_step='detecting text search tool'
print_step 'Using tracked docs and workflow validation to protect the public install contract'
if command -v rg >/dev/null 2>&1; then
  print_success 'Using ripgrep for repository scans'
else
  print_success 'Using grep fallback for repository scans'
fi

# This validator protects the published consumer install contract.
# It intentionally scans tracked Markdown, workflow, and shell files so new docs
# are picked up automatically without maintaining a brittle file allowlist.
# If consumer-facing release docs move to a new file type, update this script and
# docs/release-process.md together.
tracked_text_files=()
while IFS= read -r path; do
  if [[ -n "${path}" && "${path}" != 'CHANGELOG.md' ]]; then
    tracked_text_files+=("${path}")
  fi
done < <(git ls-files -- '*.md' '*.sh' '*.yml' '*.yaml')

print_success "Collected ${#tracked_text_files[@]} tracked Markdown, shell, and workflow files"

broken_git_subdir_pattern=':pack''ages/'
stale_pre_monorepo_version='v3.4.''3'

current_step='checking for broken git subdirectory install syntax'
print_step 'Checking tracked docs and workflows for broken git-subdirectory install syntax'
if search_fixed "${broken_git_subdir_pattern}" "${tracked_text_files[@]}"; then
  echo 'Public docs and release templates must not use git subdirectory install syntax.' >&2
  exit 1
fi
print_success 'No broken git-subdirectory install syntax found'

current_step='checking for stale pre-monorepo version references'
print_step 'Checking tracked docs for stale pre-monorepo toolkit version references'
if search_fixed "${stale_pre_monorepo_version}" "${tracked_text_files[@]}"; then
  echo 'Monorepo migration docs must use v3.4.2 as the last pre-monorepo toolkit tag.' >&2
  exit 1
fi
print_success 'No stale v3.4.3 references found'

toolkit_notes_file=$(mktemp)
react_notes_file=$(mktemp)

cleanup() {
  rm -f "${toolkit_notes_file}" "${react_notes_file}"
}

trap cleanup EXIT

current_step='rendering sample toolkit release notes'
print_step 'Rendering sample toolkit release notes'
./scripts/release/render-release-notes.sh \
  --package toolkit \
  --tag toolkit-v4.0.0 \
  --version 4.0.0 \
  --tarball ourfuturehealth-toolkit-4.0.0.tgz \
  --zip ofh-design-system-toolkit-4.0.0.zip >"${toolkit_notes_file}"

if ! file_contains_regex 'releases/download/toolkit-v4\.0\.0/ourfuturehealth-toolkit-4\.0\.0\.tgz' "${toolkit_notes_file}"; then
  echo 'Toolkit docs must point consumers at release tarball URLs.' >&2
  exit 1
fi
print_success 'Toolkit release notes render the tarball install URL'

current_step='rendering sample react release notes'
print_step 'Rendering sample react release notes'
./scripts/release/render-release-notes.sh \
  --package react-components \
  --tag react-v0.5.0 \
  --version 0.5.0 \
  --tarball ourfuturehealth-react-components-0.5.0.tgz >"${react_notes_file}"

if ! file_contains_regex 'releases/download/react-v0\.5\.0/ourfuturehealth-react-components-0\.5\.0\.tgz' "${react_notes_file}"; then
  echo 'React docs must point consumers at release tarball URLs.' >&2
  exit 1
fi
print_success 'React release notes render the tarball install URL'

current_step='printing success summary'
printf '\nRelease-contract docs validation passed.\n'
