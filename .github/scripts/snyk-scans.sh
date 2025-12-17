#!/bin/bash
set -euo pipefail

TOKEN="$1"
PROJECT_NAME="$2"
BRANCH="$3"
VERBOSITY="$4"
SNYK_TOKEN="$5"

HOST="https://ourfuturehealth.kondukto.io"

# Function to print debug messages only when verbosity is enabled
debug() {
  if [[ "$VERBOSITY" == "true" ]]; then
    echo "[DEBUG] $1"
  fi
}

# Function to log errors
log_error() {
  echo "[ERROR] $1" >&2
  exit 1
}

# Function to perform Snyk scans (SAST and SCA)
run_snyk_scans() {
  local tool="$1"
  local branch_name="$BRANCH"
  local output_file="${tool}_results.json"

  if [[ -z "${SNYK_TOKEN:-}" ]]; then
    log_error "⚠️ Scan $tool skipped: No SNYK_TOKEN provided! Please set 'SNYK_TOKEN' in the GitHub Action inputs."
  fi

  export SNYK_TOKEN="$SNYK_TOKEN"
  export SNYK_API="https://app.eu.snyk.io/api"

  # Authenticate with Snyk
  if ! $GITHUB_WORKSPACE/snyk auth "$SNYK_TOKEN"; then
    log_error "⚠️ Scan ($tool) skipped: Snyk authentication failed! Ensure the SNYK_TOKEN is valid."
  fi

  debug "Running $tool scan on branch: $branch_name"

  # Build the Snyk command based on the tool
  local snyk_command
  if [[ "$tool" == "snyksca" ]]; then
    snyk_command="$GITHUB_WORKSPACE/snyk test \
      --target-reference=\"$branch_name\" \
      --all-projects \
      --json-file-output=\"$output_file\""
  elif [[ "$tool" == "snyksast" ]]; then
    snyk_command="$GITHUB_WORKSPACE/snyk code test \
      --target-reference=\"$branch_name\" \
      --all-projects \
      --json-file-output=\"$output_file\""
  fi

  debug "Executing Snyk command: $snyk_command"
  eval "$snyk_command" 2>&1 | tee snyk_debug.log
  snyk_exit_code=$?

  if [[ "$snyk_exit_code" -eq 0 || "$snyk_exit_code" -eq 1 ]]; then
    debug "Snyk scan ($tool) completed successfully with exit code $snyk_exit_code."
  else
    log_error "⚠️ Snyk scan ($tool) failed! Exit code: $snyk_exit_code"
  fi

  # Check if the output file was created
  if [[ -f "$output_file" ]]; then
    debug "Snyk scan results saved in: $output_file"
    debug "Uploading scan results to Kondukto API..."
    response=$(curl --location --request POST "$HOST/api/v2/scans/import" \
      --header "X-Cookie: $TOKEN" \
      --header "Content-Type: multipart/form-data" \
      --form "project=$PROJECT_NAME" \
      --form "branch=$BRANCH" \
      --form "tool=$tool" \
      --form "file=@$output_file" \
      --silent --write-out "%{http_code}" --output kondukto_upload_response.json)

    http_code="${response: -3}"

    if [[ "$http_code" -ne 200 ]]; then
      log_error "🚨 Failed to upload results to Kondukto! HTTP status: $http_code"
      cat kondukto_upload_response.json  # Show API response for debugging
    fi

    debug "✅ Successfully uploaded Snyk scan results to Kondukto."
  else
    debug "Snyk scan results file ($output_file) was not found!"
  fi
}

# Main function to orchestrate Snyk scans
run_all_scans() {
  debug "Starting Snyk scans..."
  run_snyk_scans "snyksca"
  run_snyk_scans "snyksast"
  echo "✅ All Snyk scans completed."
}

# Initialize and run scans
debug "Running Snyk Scan Script"
run_all_scans