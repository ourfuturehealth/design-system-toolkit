# Component PR Readiness Template Prompt

This template is for the final repo-wide cleanup once a component branch is functionally done and you want to make it review-ready.

Use this prompt after manual QA passes, or when you want the final PR-preparation sweep across docs, release notes, branch state, and commits.

---

## How to Use This Template

1. Copy the prompt block below.
2. Replace the placeholders with your component and branch details.
3. Paste it into the agent working in that worktree.
4. Let the agent prepare the branch for review, then inspect the summary and commit history.

---

## Prompt

```md
I'm working on the `[ComponentName]` update in this worktree.

Context:
- Ticket: `[JIRA URL or ID]`
- Intended base branch: `[origin/main or another branch/PR]`
- Local site/docs server: `[http://localhost:8080]`
- Local Storybook server: `[http://localhost:6006]`
- If relevant, Figma: `[FIGMA URL]`
- If relevant, related PRs or dependency order: `[details]`

I want you to make this branch PR-ready.

Workflow I want you to follow:
1. Inspect the current diff, branch status, and recent component work across toolkit, React, docs/examples, Storybook, and tests.
2. Give me a concise "what changed" summary in practical terms.
3. Do a mechanical diff-hygiene pass:
   - `git status --short`
   - `git diff --stat`
   - `git diff --check`
   - targeted searches for old component names, old routes, outdated install tags, stale Storybook/docs references, and deprecated API wording
4. Do a repo-wide stale-reference sweep for user-facing and contributor-facing surfaces that commonly drift:
   - docs side navigation
   - site map pages
   - `sitemap.xml`
   - examples index
   - related component and pattern pages
   - package READMEs
   - migration/upgrading docs
   - changelog or release notes
5. Check public API and migration clarity:
   - confirm deprecated compatibility paths exist only where intended
   - confirm toolkit vs React consumer expectations are documented clearly
   - add or refresh migration guidance if the branch changes APIs, names, routes, or recommended usage
6. If any stale references, repo-drift issues, or missing release-doc updates are found, fix them with minimal changes and run the required checks.
7. Make sure the branch is attached if the worktree is on a detached `HEAD`.
8. Update the branch against the intended base branch using the repo's preferred workflow:
   - merge or rebase, whichever is appropriate
   - if another PR must land first, explain that clearly and stop before forcing a bad merge
   - if updating from base introduces dependency, lint, test, or build issues, fix them as part of branch prep
9. Re-run final validation after the cleanup and base-branch update:
   - `npm test` after JavaScript or TypeScript changes
   - `pnpm lint`
   - `pnpm build` when relevant
   - any package-specific checks that matter, especially Storybook if React/docs were touched
10. If any lint/build/test issue appears during the review-ready stage, explain clearly:
   - what failed
   - whether it came from this branch, from updating from base, or from local dependency drift
   - what you changed to resolve it
11. Create appropriate conventional commit(s):
   - use concise subjects
   - include short bodies when helpful
   - if there are clearly separate concerns, split them into logical commits
12. Once the branch is fully ready, draft:
   - a PR title
   - a concise PR description in the style used in this repo
13. Do not push. Give me the exact `git push` command(s) to run manually.

Important constraints:
- Run `npm test` after modifying JavaScript or TypeScript files.
- Run `pnpm lint` before considering the branch ready to push.
- Prefer minimal, surgical changes.
- Keep toolkit and React parity in scope where that is part of the intended component API.
- If docs/examples are missing what is needed for consumers or reviewers, improve them.
- If release or migration docs are expected for this repo, include them so the PR is review-ready rather than code-only.
- If the branch depends on another PR landing first, do not force a merge from the wrong base just to satisfy the workflow.
- Leave unrelated modified or untracked files alone unless I explicitly ask you to include them.
- At the end, summarize:
  - the main functional changes
  - any repo-wide cleanup or stale-reference fixes
  - any post-base-update fixes
  - the exact checks run
  - the exact commit(s) created
  - the exact push command(s)

Output style I want from you:
- Be practical and direct.
- Keep the cleanup work moving rather than stopping after every minor step.
- Explain stale-reference or migration issues plainly.
- Keep the final summary concise but complete enough for PR handoff.
```

---

## Notes

- This template is intentionally focused on review-readiness rather than interactive QA.
- Use `component-validation-qa-template-prompt.md` when you want the agent to stop after each validation step and wait for pass/fail feedback.
