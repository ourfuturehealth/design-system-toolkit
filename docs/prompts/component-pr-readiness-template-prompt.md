# Component Merge Readiness Template Prompt

This template is for the final repo-wide cleanup once a component branch is functionally done and you want to make it merge-ready.

Use this prompt after manual QA passes, or when you want the final merge-preparation sweep across docs, release notes, branch state, commits, release prep, and PR metadata.

This prompt assumes the implementation phase already included the main template's documentation and Storybook UX pass. Merge-readiness work should verify consistency and clean up leftovers, not rely on this stage as the first place to discover misleading Storybook controls or unclear prop descriptions.

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

I want you to make this branch merge-ready.

Treat `merge-ready` as `reviewable, independently releasable, and safe to merge into the intended base branch` unless I explicitly say this branch is intentionally non-releasable.

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
5. Decide release impact before sign-off:
   - determine which published packages are affected: `toolkit`, `react-components`, `both`, or `none`
   - recommend the correct bump type for each affected package: `patch`, `minor`, or `major`
   - explain the reasoning briefly in user-facing terms
   - if this branch is expected to be independently releasable, apply the version bump instead of only suggesting it
   - if no package version, changelog entry, or migration guidance is updated for an affected releasable package, treat that as a merge-readiness failure and fix it before sign-off
6. Check public API and migration clarity:
   - confirm deprecated compatibility paths exist only where intended
   - confirm toolkit vs React consumer expectations are documented clearly
   - confirm Storybook controls policy and prop docs are still coherent after any late changes
   - confirm the Storybook surface still follows the intended `Docs` / `Default` / `Builder` / showcase shape, or explain clearly why a component needs a different pattern
   - confirm the Docs page still teaches the real React API rather than a mixture of real props and story-only helper args
   - confirm no interactive single-component stories are still relying on raw JSON controls for stable nested props when clearer story-specific controls would be more usable
   - confirm no story is exposing controls for values the component visibly ignores or overrides
   - confirm copyable example snippets still show meaningful structured-prop shapes instead of hiding them behind undeclared variables
   - if the component was touched by a spacing/typography token migration, do a final spot-check for same-number static-token substitutions where Figma expected responsive tokens
   - do a final spot-check for accidental semantic-element inheritance (`p`, `ul`, `li`, `h*`, `a`) that may have reintroduced wrong spacing or typography
   - confirm release/version metadata is internally consistent for every affected releasable package:
     - `packages/*/package.json` version fields
     - `CHANGELOG.md`
     - `UPGRADING.md`
     - release/versioning strategy docs
     - PR title/body if it mentions planned release versions or tags
   - if docs claim a package release version or tag that is not reflected in the relevant `package.json`, treat that as a merge-readiness failure and fix it before sign-off
   - identify any temporary internal adapters or dependency workarounds that were introduced because a reusable component was missing or not ready
   - if any remain, either remove them or document them explicitly as follow-up debt
   - add or refresh migration guidance if the branch changes APIs, names, routes, or recommended usage
7. If any stale references, repo-drift issues, or missing release-doc updates are found, fix them with minimal changes and run the required checks.
8. Make sure the branch is attached if the worktree is on a detached `HEAD`.
9. Update the branch against the intended base branch using the repo's preferred workflow:
   - merge or rebase, whichever is appropriate
   - if another PR must land first, explain that clearly and stop before forcing a bad merge
   - if updating from base introduces dependency, lint, test, or build issues, fix them as part of branch prep
10. Re-run final validation after the cleanup and base-branch update:
   - `npm test` after JavaScript or TypeScript changes
   - `pnpm lint`
   - `pnpm build` when relevant
   - `pnpm docs:release-contract` for releasable branches
   - `pnpm smoke:release-artifacts` when preparing a package release branch that bumps a published package version
   - any package-specific checks that matter, especially Storybook if React/docs were touched
11. If any lint/build/test issue appears during the merge-ready stage, explain clearly:
   - what failed
   - whether it came from this branch, from updating from base, or from local dependency drift
   - what you changed to resolve it
12. Create appropriate conventional commit(s):
   - use concise subjects
   - include short bodies when helpful
   - if there are clearly separate concerns, split them into logical commits
13. Once the branch is fully ready, draft the PR metadata in the house style used in this repo:
   - use a ticket-led title when the branch maps cleanly to ticketed work:
     - single ticket: `[TICKET] :: [concise scope summary]`
     - multi-ticket: `[TICKET A] / [TICKET B] :: [shared scope summary]`
   - use a non-ticket title only for repo/infra/release work that genuinely does not map to a ticket
   - keep titles short, specific, and noun-led where possible; avoid filler such as "misc", "stuff", or generic "update" unless it adds clarity
   - use the repo-style sections intentionally rather than mechanically
   - start from the common section set below, but only keep sections that add reviewer value for this specific PR:
     - `## Description`
     - `Ticket:`, `Tickets:`, or `Closes:`
     - `## Release scope` or `## Scope`
     - `## Breaking Changes`
     - `## Key Changes`
     - `## Validation`
     - `## Reviewer Focus`
   - section selection rules:
     - always include `## Description`
     - include `Ticket:`, `Tickets:`, or `Closes:` when the work maps to ticketed work
     - use `## Release scope` when package version bumps, release metadata, or release coordination are part of the branch
     - use `## Scope` when the branch needs contextual boundaries but release scope is not the main framing
     - include `## Breaking Changes` when the PR is breaking, or when explicitly saying `None.` helps reviewers and release prep
     - include `## Key Changes` when there are multiple meaningful change buckets; for very small PRs, fold the substance into `## Description` instead
     - include `## Validation` with exact commands and meaningful manual QA surfaces
     - include `## Reviewer Focus` when you can point reviewers at the highest-risk or highest-value review areas; omit it when it would only repeat the obvious diff
   - body-writing rules:
     - opening paragraph pattern: `This PR delivers **[ticket/work summary]** across [affected surfaces].`
     - add a second context paragraph only when it genuinely helps, for example rebases, stacked dependencies, release baseline shifts, or why the branch goes beyond a narrow ticket interpretation
     - keep the body review-oriented: explain what changed, why it changed, release impact, and where reviewers should focus
     - avoid padding the PR with empty, repetitive, or low-information sections just to match a template
14. Do not push. Give me the exact `git push` command(s) to run manually.

Important constraints:
- Default to independently releasable branches for review units unless I explicitly tell you otherwise.
- If the branch changes a published package, do not sign off merge readiness until you have assessed release impact and either applied or explicitly justified the absence of package-version, changelog, and migration updates.
- Run `npm test` after modifying JavaScript or TypeScript files.
- Run `pnpm lint` before considering the branch ready to push.
- Prefer minimal, surgical changes.
- Keep toolkit and React parity in scope where that is part of the intended component API.
- If docs/examples are missing what is needed for consumers or reviewers, improve them.
- If release or migration docs are expected for this repo, include them so the PR is review-ready rather than code-only.
- Do not leave temporary dependency stand-ins implicit. Remove them if the real dependency is now available, or document them clearly if they must remain temporarily.
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

- This template is intentionally focused on merge-readiness rather than interactive QA.
- Use `component-validation-qa-template-prompt.md` when you want the agent to stop after each validation step and wait for pass/fail feedback.
