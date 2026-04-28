#!/usr/bin/env bash

set -euo pipefail

packages_json="${PACKAGES_JSON:-[]}"
if ! jq -e . >/dev/null 2>&1 <<< "${packages_json}"; then
  packages_json='[]'
fi

repository="${GITHUB_REPOSITORY:-${REPOSITORY:-unknown}}"
commit_sha="${GITHUB_SHA:-${COMMIT_SHA:-unknown}}"
short_sha="${commit_sha:0:7}"
responsible_user="${RESPONSIBLE_USER:-${GITHUB_ACTOR:-unknown}}"

package_summary=$(jq -r '
  if type == "array" and length > 0 then
    map("\(.package) \(.version) -> \(.tag)") | join("\n")
  else
    "No candidate packages"
  end
' <<< "${packages_json}")

candidate_tags=$(jq -r '
  if type == "array" and length > 0 then
    map(.tag) | join(", ")
  else
    "none"
  end
' <<< "${packages_json}")

release_urls=$(jq -r --arg repository "${repository}" '
  if type == "array" and length > 0 then
    map("https://github.com/\($repository)/releases/tag/\(.tag)") | join("\n")
  else
    ""
  end
' <<< "${packages_json}")

release_environment=$(jq -r '
  if type == "array" and length > 0 and ([.[].test] | all) then
    "dry-run"
  else
    "production"
  end
' <<< "${packages_json}")

pull_request='No associated pull request'
if [[ -n "${PR_URL:-}" ]]; then
  pull_request="#${PR_NUMBER:-unknown} ${PR_TITLE:-unknown} ${PR_URL}"
elif [[ -n "${PR_NUMBER:-}" ]]; then
  pull_request="#${PR_NUMBER} ${PR_TITLE:-unknown}"
fi

payload=$(jq -n \
  --arg status "${RELEASE_STATUS:-unknown}" \
  --arg environment "${release_environment}" \
  --arg repository "${repository}" \
  --arg summary "${RELEASE_SUMMARY:-unknown}" \
  --arg package_summary "${package_summary}" \
  --arg candidate_tags "${candidate_tags}" \
  --arg release_urls "${release_urls}" \
  --arg workflow_url "${WORKFLOW_URL:-unknown}" \
  --arg pull_request "${pull_request}" \
  --arg actor "${responsible_user}" \
  --arg commit "${short_sha}" \
  --arg failed_gate "${FAILED_GATE:-none}" \
  --arg repair_issue_url "${REPAIR_ISSUE_URL:-}" \
  '{
    status: $status,
    environment: $environment,
    repository: $repository,
    summary: $summary,
    package_summary: $package_summary,
    candidate_tags: $candidate_tags,
    release_urls: $release_urls,
    workflow_url: $workflow_url,
    pull_request: $pull_request,
    actor: $actor,
    commit: $commit,
    failed_gate: $failed_gate,
    repair_issue_url: $repair_issue_url
  }')

if [[ "${SLACK_RELEASE_NOTIFY_DRY_RUN:-false}" == 'true' ]]; then
  printf '%s\n' "${payload}"
  exit 0
fi

if [[ -z "${SLACK_RELEASE_WORKFLOW_WEBHOOK_URL:-}" ]]; then
  echo 'SLACK_RELEASE_WORKFLOW_WEBHOOK_URL is not configured; skipping Slack release notification.'
  exit 0
fi

curl \
  --fail \
  --silent \
  --show-error \
  --request POST \
  --header 'Content-Type: application/json' \
  --data "${payload}" \
  "${SLACK_RELEASE_WORKFLOW_WEBHOOK_URL}"

echo 'Slack release notification sent.'
