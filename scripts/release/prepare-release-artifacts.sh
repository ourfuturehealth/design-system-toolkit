#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'EOF' >&2
Usage: prepare-release-artifacts.sh <toolkit|react-components> [--stage-dir <dir>] [--metadata-file <path>] [--github-output <path>]
EOF
}

current_step='initializing release asset preparation'
temp_files=()

print_step() {
  printf ' -> %s\n' "$1"
}

print_success() {
  printf ' ✓ %s\n' "$1"
}

print_failure() {
  printf '\n✗ %s\n' "$1" >&2
}

on_error() {
  printf 'Release asset preparation failed while %s.\n' "${current_step}" >&2
}

cleanup() {
  if [[ ${#temp_files[@]} -gt 0 ]]; then
    rm -f "${temp_files[@]}"
  fi
}

trap on_error ERR
trap cleanup EXIT

run_quiet_step() {
  local description=$1
  shift

  local log_file
  log_file=$(mktemp)
  temp_files+=("${log_file}")

  if "$@" >"${log_file}" 2>&1; then
    return 0
  fi

  print_failure "${description}"
  cat "${log_file}" >&2
  return 1
}

run_quiet_capture_stdout() {
  local description=$1
  local stdout_file=$2
  shift 2

  local log_file
  log_file=$(mktemp)
  temp_files+=("${log_file}" "${stdout_file}")

  if "$@" >"${stdout_file}" 2>"${log_file}"; then
    return 0
  fi

  print_failure "${description}"
  cat "${log_file}" >&2
  if [[ -s "${stdout_file}" ]]; then
    cat "${stdout_file}" >&2
  fi
  return 1
}

write_output() {
  local key=$1
  local value=$2

  if [[ -n "${metadata_file}" ]]; then
    printf '%s=%q\n' "${key}" "${value}" >> "${metadata_file}"
  fi

  if [[ -n "${github_output}" ]]; then
    printf '%s=%s\n' "${key}" "${value}" >> "${github_output}"
  fi
}

list_directory() {
  local dir=$1

  if [[ -d "${dir}" ]]; then
    printf 'Directory contents for %s:\n' "${dir}" >&2
    ls -la "${dir}" >&2
    return
  fi

  printf 'Directory does not exist: %s\n' "${dir}" >&2
}

package=''
stage_dir=''
metadata_file=''
github_output=${GITHUB_OUTPUT:-}

while [[ $# -gt 0 ]]; do
  case "$1" in
    toolkit|react-components)
      if [[ -n "${package}" ]]; then
        usage
        exit 1
      fi
      package="$1"
      shift
      ;;
    --stage-dir)
      stage_dir="$2"
      shift 2
      ;;
    --metadata-file)
      metadata_file="$2"
      shift 2
      ;;
    --github-output)
      github_output="$2"
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

if [[ -z "${package}" ]]; then
  usage
  exit 1
fi

repo_root=$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)
cd "${repo_root}"

if [[ -z "${stage_dir}" ]]; then
  stage_dir=$(mktemp -d "${TMPDIR:-/tmp}/ofh-release-assets.${package}.XXXXXX")
fi

mkdir -p "${stage_dir}"
if find "${stage_dir}" -mindepth 1 -print -quit | grep -q .; then
  echo "Stage directory must be empty: ${stage_dir}" >&2
  exit 1
fi

stage_dir=$(cd "${stage_dir}" && pwd)

if [[ -n "${metadata_file}" ]]; then
  : > "${metadata_file}"
fi

case "${package}" in
  toolkit)
    package_dir='packages/toolkit'
    package_scope='@ourfuturehealth/toolkit'
    build_command=(pnpm --filter=@ourfuturehealth/toolkit run zip)
    ;;
  react-components)
    package_dir='packages/react-components'
    package_scope='@ourfuturehealth/react-components'
    build_command=(pnpm --filter=@ourfuturehealth/react-components run build)
    ;;
esac

package_manifest="${repo_root}/${package_dir}/package.json"
current_step="reading ${package} package manifest"
print_step "Reading ${package} package metadata"
version=$(node -p "require(process.argv[1]).version" "${package_manifest}")
print_success "Loaded ${package_scope}@${version}"

current_step="building ${package} release artifacts"
print_step "Building ${package} release artifacts"
run_quiet_step \
  "Building ${package} release artifacts failed" \
  "${build_command[@]}"
print_success "Built ${package} release artifacts"

zip_name=''
zip_path=''

# Stage assets outside the package tree before running npm pack.
# CI showed the toolkit zip existed immediately after build but later vanished
# when the workflow tried to rediscover it from dist/, so downstream steps
# should only read from the staged copy.
if [[ "${package}" == 'toolkit' ]]; then
  current_step='staging toolkit compiled zip'
  zip_name="ofh-design-system-toolkit-${version}.zip"
  expected_zip_path="${repo_root}/${package_dir}/dist/${zip_name}"
  print_step "Staging toolkit compiled zip ${zip_name}"

  if [[ ! -f "${expected_zip_path}" ]]; then
    print_failure "Missing expected toolkit zip ${expected_zip_path}"
    list_directory "${repo_root}/${package_dir}/dist"
    exit 1
  fi

  cp "${expected_zip_path}" "${stage_dir}/${zip_name}"
  zip_path="${stage_dir}/${zip_name}"

  if [[ ! -f "${zip_path}" ]]; then
    print_failure "Failed to stage toolkit zip ${zip_path}"
    list_directory "${stage_dir}"
    exit 1
  fi

  print_success "Staged toolkit zip ${zip_name}"
fi

current_step="packing ${package} tarball"
print_step "Packing ${package} tarball into ${stage_dir}"
pack_output=$(mktemp)
run_quiet_capture_stdout \
  "Packing ${package} tarball failed" \
  "${pack_output}" \
  npm pack "./${package_dir}" --ignore-scripts --json --pack-destination "${stage_dir}"

tarball_name=$(node - <<'NODE' "${pack_output}"
const fs = require('fs');
const outputPath = process.argv[2];
const raw = fs.readFileSync(outputPath, 'utf8');
const parsed = JSON.parse(raw);

if (!Array.isArray(parsed) || parsed.length === 0 || typeof parsed[0].filename !== 'string') {
  console.error('npm pack did not return a tarball filename in JSON output');
  process.exit(1);
}

process.stdout.write(parsed[0].filename);
NODE
)

tarball_path="${stage_dir}/${tarball_name}"
if [[ ! -f "${tarball_path}" ]]; then
  print_failure "Missing staged tarball ${tarball_path}"
  list_directory "${stage_dir}"
  exit 1
fi

print_success "Staged tarball ${tarball_name}"

write_output 'PACKAGE' "${package}"
write_output 'PACKAGE_DIR' "${repo_root}/${package_dir}"
write_output 'VERSION' "${version}"
write_output 'STAGE_DIR' "${stage_dir}"
write_output 'TARBALL_NAME' "${tarball_name}"
write_output 'TARBALL_PATH' "${tarball_path}"

if [[ "${package}" == 'toolkit' ]]; then
  write_output 'ZIP_NAME' "${zip_name}"
  write_output 'ZIP_PATH' "${zip_path}"
fi

printf '\nPrepared release assets:\n'
printf '  package: %s\n' "${package}"
printf '  version: %s\n' "${version}"
printf '  stage dir: %s\n' "${stage_dir}"
printf '  tarball: %s\n' "${tarball_path}"
if [[ "${package}" == 'toolkit' ]]; then
  printf '  zip: %s\n' "${zip_path}"
fi
