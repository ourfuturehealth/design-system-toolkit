#!/bin/bash
set -euo pipefail

# Script parameters
TOKEN="$1"
PROJECT_NAME="$2" 
BRANCH="$3"
SNYK_TOKEN="$4"
VERBOSITY="${5:-false}"  # Optional, defaults to false

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
}

# Function to retrieve the action version
get_action_version() {
  git describe --tags --always 2>/dev/null || echo "unknown-version"
}

# Function to redact the token for logs
redact_token() {
  if [[ -z "$TOKEN" ]]; then
    echo "Null"
  elif [[ "$TOKEN" == "" ]]; then
    echo "Empty"
  else
    echo "****"
  fi
}

# Function to perform Snyk scans (lifted from original script)
run_snyk_scans() {
  local tool="$1"
  local repo_name="${GITHUB_REPOSITORY:-$PROJECT_NAME}"
  local branch_name="$BRANCH"
  local output_file="${tool}_results.json"

  if [[ -z "${SNYK_TOKEN:-}" ]]; then
    log_error "⚠️ Scan $tool skipped: No snyk_token provided! To enable Snyk SCA and SAST scans, please set 'snyk_token' in the GitHub Action inputs as the SNYK_TOKEN org secret."
    return 0
  fi

  export SNYK_TOKEN="$SNYK_TOKEN"
  export SNYK_API="https://app.eu.snyk.io/api"
  
  # Install Snyk if not available
  if ! command -v snyk &> /dev/null; then
    debug "Installing Snyk CLI..."
    curl -L -o snyk https://github.com/snyk/cli/releases/latest/download/snyk-linux
    chmod +x snyk
    sudo mv snyk /usr/local/bin/
  fi
  
  if ! snyk auth "$SNYK_TOKEN"; then
    log_error "⚠️ Scan ($tool) skipped: Snyk authentication failed! Please ensure you have passed the snyk token from the org secrets in Github."
    return 1
  fi

  debug "Running $tool scan on project: $repo_name and branch: $branch_name"

  local snyk_command
  if [[ "$tool" == "snyksca" ]]; then
    snyk_command="snyk test \
      --target-reference=\"$branch_name\" \
      --all-projects \
      --json-file-output=\"$output_file\""
  elif [[ "$tool" == "snyksast" ]]; then
    snyk_command="snyk code test \
      --target-reference=\"$branch_name\" \
      --all-projects \
      --json-file-output=\"$output_file\""
  fi

  eval "$snyk_command"
  snyk_exit_code=$?

  if [[ "$snyk_exit_code" -eq 0 || "$snyk_exit_code" -eq 1 ]]; then
    debug "Snyk scan ($tool) completed successfully with exit code $snyk_exit_code."
  else
    log_error "⚠️ Snyk scan ($tool) failed! Exit code: $snyk_exit_code"
    return 1
  fi

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
      return 1
    fi

    debug "✅ Successfully uploaded Snyk scan results to Kondukto."

  else
    log_error "Snyk scan results file ($output_file) was not found!"
    return 1
  fi
}

# Main execution
main() {
  debug "Running Kondukto Snyk Scans (version: $(get_action_version))"
  
  # Run both Snyk SCA and SAST
  run_snyk_scans "snyksca"
  run_snyk_scans "snyksast"
  
  echo "✅ All Snyk scans completed."
}

# Run main function
main "$@"