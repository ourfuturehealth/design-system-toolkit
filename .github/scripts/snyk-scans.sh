#!/bin/bash
set -euo pipefail

TOKEN="$1"
PROJECT_NAME="$2"
BRANCH="$3"
LANGUAGES="$4"
IMAGE="$5"
IAC_PLANS_FOLDER_LOCATION="$6"
VERBOSITY="$7"
SNYK_TOKEN="$8"
IMAGES="$9"
PATH_TO_IMAGES="${10}"

HOST="https://ourfuturehealth.kondukto.io"

# Declare TOOL_MATRIX Associative Array
declare -A TOOL_MATRIX=(
  ["ruby"]="brakeman snyksast"
  ["python"]="bandit snyksast"
  ["js"]="semgrep snyksast"
  ["IaC"]="checkmarxkics tfsec"
)

SCA_TOOLS=("osvscannersca" "dependabot" "snyksca")
SECRET_SCANNERS=("gitleaks" "trufflehogsecurity")
CONTAINER_TOOLS=("trivy")

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

# Fuction to initialize EXTRA_PARAMS
initialize_extra_params() {
  EXTRA_PARAMS="${EXTRA_PARAMS:-}"

  # Add verbose flag if verbosity is true
  if [[ "$VERBOSITY" == "true" ]]; then
    EXTRA_PARAMS="$EXTRA_PARAMS --verbose"
  fi

  debug "EXTRA_PARAMS initialized to: '$EXTRA_PARAMS'"
}

# Function to print the kdt command with redacted token
print_kdt_command() {
  local tool="$1"
  local extra_params="${2:-}"

  if [[ -n "$extra_params" ]]; then
    echo "kdt scan --host $HOST --token $(redact_token) -p $PROJECT_NAME -t $tool -b $BRANCH $extra_params --async"
  else
    echo "kdt scan --host $HOST --token $(redact_token) -p $PROJECT_NAME -t $tool -b $BRANCH --async"
  fi
}

# Fuction to perform Snyk scans
run_snyk_scans() {
  local tool="$1"
  local repo_name="${GITHUB_REPOSITORY}"
  local branch_name="$BRANCH"
  local output_file="${tool}_results.json"

  if [[ -z "${SNYK_TOKEN:-}" ]]; then
    log_error "⚠️ Scan $tool skipped: No snyk_token provided! To enable Snyk SCA and SAST scans, please set 'snyk_token' in the GitHub Action inputs as the SNYK_TOKEN org secret."
    return 0
  fi

  export SNYK_TOKEN="$SNYK_TOKEN"
  export SNYK_API="https://app.eu.snyk.io/api"
  if ! $GITHUB_WORKSPACE/snyk auth "$SNYK_TOKEN"; then
    log_error "⚠️ Scan ($tool) skipped: Snyk authentication failed! Please ensure you have passed the snyk token from the org secrets in Github."
    return 1
  fi

  debug "Running $tool scan on project: $repo_name and branch: $branch_name"

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

# Function to perform local Trivy scans and upload results using KDT CLI
run_trivy_local_scan() {
  local image_path="$1"
  local image_name="$2"
  local output_file="trivy_local_${image_name//\//_}.json"

  debug "Running local Trivy image scan on: $image_path"

  # Run Trivy scan locally
  local trivy_command="$GITHUB_WORKSPACE/trivy image $image_path --format json --output $output_file"
  debug "Executing: $trivy_command"
  
  if ! eval "$trivy_command"; then
    trivy_exit_code=$?
    log_error "⚠️ Trivy local scan failed for $image_path! Exit code: $trivy_exit_code"
    return 1
  fi

  debug "Trivy local scan completed successfully for $image_path"

  # Upload results to Kondukto using KDT CLI
  if [[ -f "$output_file" ]]; then
    debug "Trivy scan results saved in: $output_file"
    debug "Uploading scan results to Kondukto using KDT CLI with metadata: $image_name"
    
    # Show comprehensive debugging info only when verbose is enabled
    if [[ "$VERBOSITY" == "true" ]]; then
      file_size=$(stat -c%s "$output_file" 2>/dev/null || echo "unknown")
      debug "Scan results file size: $file_size bytes"
      debug "First 3 lines of scan results:"
      head -3 "$output_file" | while read line; do debug "$line"; done
    fi
    
    # Use KDT CLI to upload the scan results with metadata
    if [[ "$VERBOSITY" == "true" ]]; then
      debug "Executing KDT command: kdt scan --host $HOST --token **** -p $PROJECT_NAME -t trivy -b $BRANCH -f $output_file -m $image_name"
      echo "Executing: kdt scan --host $HOST --token **** -p $PROJECT_NAME -t trivy -b $BRANCH -f $output_file -m $image_name"
    fi
    
    # Execute the KDT command
    if ! kdt scan --host "$HOST" --token "$TOKEN" -p "$PROJECT_NAME" -t trivy -b "$BRANCH" -f "$output_file" -m "$image_name"; then
      kdt_exit_code=$?
      log_error "🚨 Failed to upload Trivy results using KDT CLI! Exit code: $kdt_exit_code"
      return 1
    fi

    debug "✅ Successfully uploaded Trivy local scan results to Kondukto using KDT CLI for $image_name"
  else
    log_error "Trivy scan results file ($output_file) was not found!"
    return 1
  fi
}

# Function to run a scan with a given tool and handle failures
run_tool_scan() {
  local tool="$1"
  local extra_params="${2:-}"

  debug "Processing scan for tool: $tool"

  if [[ "$tool" == "snyksca" || "$tool" == "snyksast" ]]; then
    debug "Running Snyk CLI scan for $tool"
    run_snyk_scans "$tool" || log_error "$tool Failed"
  else
    debug "Running Kondukto (KDT) scan for $tool"
    
    if [[ -n "$extra_params" ]]; then
      echo "Executing: kdt scan --host $HOST --token **** -p $PROJECT_NAME -t $tool -b $BRANCH $extra_params --async"
      if ! kdt scan --host "$HOST" --token "$TOKEN" -p "$PROJECT_NAME" -t "$tool" -b "$BRANCH" $extra_params --async; then
        log_error "Scan failed with tool: $tool and extra params: $extra_params"
      fi
    else
      echo "Executing: kdt scan --host $HOST --token **** -p $PROJECT_NAME -t $tool -b $BRANCH --async"
      if ! kdt scan --host "$HOST" --token "$TOKEN" -p "$PROJECT_NAME" -t "$tool" -b "$BRANCH" --async; then
        log_error "Scan failed with tool: $tool (no extra params)"
      fi
    fi
  fi
}

# Function to run multiple tool scans
run_tool_scans() {
  local tools=("$@")
  local extra_params="${EXTRA_PARAMS:-}"

  for tool in "${tools[@]}"; do
    run_tool_scan "$tool" "$extra_params"
  done
}

# Function to handle local path-based container scans
run_local_trivy_scans() {
  if [[ -z "$PATH_TO_IMAGES" ]]; then
    debug "No path_to_images parameter provided. Skipping local Trivy scans."
    return 0
  fi

  debug "Running local Trivy scans for path_to_images: $PATH_TO_IMAGES"
  
  IFS=',' read -r -a IMAGE_PATH_LIST <<< "$PATH_TO_IMAGES"
  for img_path in "${IMAGE_PATH_LIST[@]}"; do
    img_path=$(echo "$img_path" | xargs)  # Trim whitespace
    if [[ -n "$img_path" ]]; then
      # Extract image name for metadata (remove registry prefix and version/tag)
      local image_name=$(basename "$img_path" | cut -d':' -f1)
      debug "Running local Trivy scan for image path: $img_path (metadata: $image_name)"
      run_trivy_local_scan "$img_path" "$image_name" || log_error "Local Trivy scan failed for image: $img_path"
    fi
  done
}

# Function to handle SAST scans for all provided languages
run_sast_scans() {
  local languages="$1"
  IFS=',' read -r -a LANGUAGES_ARRAY <<< "$languages"

  for LANGUAGE in "${LANGUAGES_ARRAY[@]}"; do
    LANGUAGE=$(echo "$LANGUAGE" | xargs)  # Trim whitespace
    if [[ -v TOOL_MATRIX["$LANGUAGE"] ]]; then
      debug "SAST tools for language '$LANGUAGE': ${TOOL_MATRIX[$LANGUAGE]}"
      IFS=' ' read -r -a tools <<< "${TOOL_MATRIX[$LANGUAGE]}"
      run_tool_scans "${tools[@]}"
    else
      log_error "Warning: Language '$LANGUAGE' is not supported for SAST. Skipping."
    fi
  done
}

# Function to handle SCA and secret scanning
run_sca_and_secret_scans() {
  run_tool_scans "${SCA_TOOLS[@]}"
  run_tool_scans "${SECRET_SCANNERS[@]}"
}

run_container_scans() {
  local index=1

  # Backward-compatible single image scan
  if [[ -n "$IMAGE" ]]; then
    debug "Running container scan on single image: $IMAGE..."
    EXTRA_PARAMS="--image $IMAGE -m image-scan-$index"
    run_tool_scans "${CONTAINER_TOOLS[@]}"
    unset EXTRA_PARAMS
    index=$((index + 1))
  else
    debug "No legacy 'image' parameter provided. Skipping single image scan."
  fi

  # Handle multiple images
  if [[ -n "$IMAGES" ]]; then
    IFS=',' read -r -a IMAGE_LIST <<< "$IMAGES"
    for img in "${IMAGE_LIST[@]}"; do
      img=$(echo "$img" | xargs)  # Trim whitespace
      if [[ -n "$img" ]]; then
        debug "Running container scan on image: $img..."
        EXTRA_PARAMS="--image $img -m image-scan-$index"
        run_tool_scans "${CONTAINER_TOOLS[@]}"
        unset EXTRA_PARAMS
        index=$((index + 1))
      fi
    done
  else
    debug "No 'images' parameter provided for multi-image scan. Skipping."
  fi
}

# Function to run IaC plan scans
run_iac_plan_scans() {
  if [[ -n "$IAC_PLANS_FOLDER_LOCATION" ]]; then
    debug "Running IaC plan scan on folder: $IAC_PLANS_FOLDER_LOCATION"
    if ! trivy config "$IAC_PLANS_FOLDER_LOCATION" -o "iac-plan-scan.json" --format json; then
      log_error "Trivy scan of IaC plan files failed."
      exit 1
    fi
    EXTRA_PARAMS="-f iac-plan-scan.json"
    run_tool_scans "trivyiac"
    unset EXTRA_PARAMS
  else
    debug "No IaC plans folder location provided. Skipping IaC plan scans."
  fi
}

# Main function to orchestrate all scans
run_all_scans() {
  debug "Starting all scans..."

  [[ -n "$LANGUAGES" ]] && run_sast_scans "$LANGUAGES" && run_sca_and_secret_scans
  run_container_scans
  run_iac_plan_scans
  
  # Run local Trivy scans if path_to_images is provided
  run_local_trivy_scans

  echo "✅ All scans completed."
}

# Initialize script
debug "Running Kondukto Scan Reusable Action (version: $(get_action_version))"
initialize_extra_params
run_all_scans