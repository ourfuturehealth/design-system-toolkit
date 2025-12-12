BRANCH_NAME="main"
REPO_NAME="ourfuturehealth/design-system-toolkit"

SNYK="$GITHUB_WORKSPACE/snyk"

echo "Authenticating to Snyk..."
$SNYK auth "$SNYK_TOKEN"

# 1) Run Snyk SCA

echo "Running Snyk SCA scan..."
$SNYK test --all-projects --target-reference="$BRANCH_NAME" --json-file-output="snyk_sca.json" || true

echo "Uploading SCA results to Kondukto..."
curl -s -X POST "$HOST/api/v2/scans/import" \
  -H "X-Cookie: $TOKEN" \
  -H "Content-Type: multipart/form-data" \
  -F "project=$PROJECT_NAME" \
  -F "branch=$BRANCH_NAME" \
  -F "tool=snyksca" \
  -F "file=@snyk_sca.json"

# 2) Run Snyk SAST

echo "Running Snyk SAST scan..."
$SNYK code test --all-projects --target-reference="$BRANCH_NAME" --json-file-output="snyk_sast.json" || true

echo "Uploading SAST results to Kondukto..."
curl -s -X POST "$HOST/api/v2/scans/import" \
  -H "X-Cookie: $TOKEN" \
  -H "Content-Type: multipart/form-data" \
  -F "project=$PROJECT_NAME" \
  -F "branch=$BRANCH_NAME" \
  -F "tool=snyksast" \
  -F "file=@snyk_sast.json"

echo "All Snyk scans completed and uploaded to Kondukto."