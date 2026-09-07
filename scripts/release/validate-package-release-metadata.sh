#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'EOF' >&2
Usage: validate-package-release-metadata.sh <base-ref> <head-ref>
EOF
}

if [[ $# -ne 2 ]]; then
  usage
  exit 1
fi

base_ref=$1
head_ref=$2

git rev-parse --verify "${base_ref}^{commit}" >/dev/null
git rev-parse --verify "${head_ref}^{commit}" >/dev/null

toolkit_changed=false
react_changed=false

is_non_release_file() {
  local path=$1

  case "$path" in
    *.test.js|*.spec.js|*.test.ts|*.test.tsx|*.spec.ts|*.spec.tsx|*.stories.tsx|*/README.md)
      return 0
      ;;
  esac

  return 1
}

while IFS= read -r path; do
  [[ -n "$path" ]] || continue
  is_non_release_file "$path" && continue

  case "$path" in
    packages/toolkit/components/*|packages/toolkit/core/*|packages/toolkit/common/*|packages/toolkit/common.js|packages/toolkit/assets/*|packages/toolkit/ofh*.js|packages/toolkit/ofh*.scss|packages/toolkit/polyfills.js|packages/toolkit/gulpfile.js)
      toolkit_changed=true
      ;;
    packages/react-components/src/*|packages/react-components/scripts/*|packages/react-components/vite.config.*|packages/react-components/tsconfig*.json)
      react_changed=true
      ;;
  esac
done < <(git diff --name-only --diff-filter=ACMRD "$base_ref" "$head_ref")

version_for() {
  local ref=$1
  local manifest=$2

  git show "${ref}:${manifest}" | node -e \
    "let input=''; process.stdin.on('data', chunk => input += chunk); process.stdin.on('end', () => process.stdout.write(JSON.parse(input).version));"
}

validate_package() {
  local package_label=$1
  local manifest=$2
  local tag_prefix=$3

  local base_version
  local head_version
  local changelog_heading

  base_version=$(version_for "$base_ref" "$manifest")
  head_version=$(version_for "$head_ref" "$manifest")

  if [[ "$base_version" == "$head_version" ]]; then
    echo "${package_label}: source changed, but version remains ${head_version}." >&2
    return 1
  fi

  changelog_heading="#### ${package_label} ${head_version} (\`${tag_prefix}${head_version}\`)"
  if ! git show "${head_ref}:CHANGELOG.md" | grep -F "${changelog_heading}" >/dev/null; then
    echo "${package_label}: missing changelog heading for ${head_version}." >&2
    return 1
  fi

  printf '%s: %s -> %s with matching changelog entry\n' "${package_label}" "${base_version}" "${head_version}"
}

validation_failed=false

if [[ "$toolkit_changed" == true ]]; then
  validate_package '@ourfuturehealth/toolkit' 'packages/toolkit/package.json' 'toolkit-v' || validation_failed=true
fi

if [[ "$react_changed" == true ]]; then
  validate_package '@ourfuturehealth/react-components' 'packages/react-components/package.json' 'react-v' || validation_failed=true
fi

if [[ "$validation_failed" == true ]]; then
  exit 1
fi

if [[ "$toolkit_changed" == true || "$react_changed" == true ]]; then
  echo 'Package release metadata validation passed.'
else
  echo 'No published package source or asset changes require release metadata.'
fi
