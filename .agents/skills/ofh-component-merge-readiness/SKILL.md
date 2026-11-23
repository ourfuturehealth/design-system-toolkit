---
name: ofh-component-merge-readiness
description: Prepare an OFH design-system component branch for human review after implementation and user-guided QA pass.
---

# OFH component merge readiness

Use only after implementation review and real contributor QA pass. Follow the [contribution workflow](../ofh-design-system-contribution/SKILL.md) and the official-plugin [Figma evidence guide](../ofh-design-system-contribution/references/figma-evidence.md) where late changes affect design claims.

Inspect branch/base, `git status --short`, `git diff --stat`, `git diff --check`, commits and changed files. Summarize toolkit, React, docs, Storybook, test and consumer impact. Search touched and adjacent surfaces for old names/routes, stale examples, exports, docs navigation, options, README and deprecated usage. Check public API, parity, accessible states, responsive token identity and computed inheritance again after late changes. Do not infer visual conformance from mechanical checks.

Confirm feature release intent using the [Changesets guide](../../../.changeset/README.md): each public package changed directly or indirectly by source/styles/templates/assets/manifest work needs a new changeset with correct bump, summary, Consumer action and Migration notes. Ask for material breaking or migration decisions; include the accepted guidance in the feature change. Repo tooling/docs, tests, stories and package README-only changes need no package changeset. Do not manually bump versions or add future `CHANGELOG.md`, `UPGRADING.md` or generated `.changeset/release.json` entries.

If base moved, verify its current remote state and update only when appropriate for the branch; do not force a dependent PR onto the wrong base. After changes, run `pnpm lint`, relevant tests and affected builds from actual package scripts. Build site HTML before site lint if necessary. For React changes, run both the React library build and Storybook build. Run `pnpm docs:release-contract` or release checks when relevant. Report failures with their source and validation limits. Simplify the final diff and leave unrelated files untouched.

After readiness checks and contributor QA pass, summarize the actual checks, release and Changeset status, and remaining limitations. If no blockers remain, say the branch is ready for manual push and a draft PR. Ask whether the contributor wants help with those steps or with drafting/opening the PR. Do not create commits or PR text proactively, and do not infer human code review from passing checks. If PR help is requested, read the [repository PR template](../../../.github/PULL_REQUEST_TEMPLATE.md) and follow it with the contributor's preferences.

Do not push, merge, tag, release or publish. Open a remote PR only when explicitly requested; create it as a draft, assign the requester, and keep it draft until they authorize ready-for-review. Do not transition a Jira ticket automatically. Provide a manual push command only after required checks pass, in the form `git -C <absolute-repo-path> push ...`. Include exact local commit IDs only if commits were requested.
