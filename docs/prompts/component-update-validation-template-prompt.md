# Component Update Validation Template Prompt

This template is for the final stretch of a component branch once implementation is mostly done and you want the agent to help you:

- understand what changed
- manually validate the work step by step
- refine any rough edges found during review
- prepare the branch for review
- create the final commit(s) and PR draft

It is designed to be reusable across worktrees and component tickets.

---

## How to Use This Template

1. Copy the prompt block below.
2. Replace the placeholders with your component and branch details.
3. Paste it into the agent working in that worktree.
4. Work through the QA flow step by step with `pass`, `fail - ...`, or `other - ...`.

---

## Prompt

```md
I'm working on the `[ComponentName]` update in this worktree.

Context:
- Ticket: `[JIRA URL or ID]`
- Local site/docs server: `[http://localhost:8080]`
- Local Storybook server: `[http://localhost:6006]`
- If relevant, Figma: `[FIGMA URL]`

I want you to help me finish this branch using the same workflow we used for Error Summary.

Workflow I want you to follow:
1. Inspect the current implementation and current diff for this component across toolkit, React, docs/examples, Storybook, and tests.
2. Give me a concise "what changed" summary in practical terms so I know what I'm validating.
3. Build a manual QA script with exact URLs and a pass/fail table.
4. Then walk me through that QA script one step at a time.
5. After each step, stop and wait for my response in the format:
   - `pass`
   - `fail - ...`
   - `other - ...`
6. Treat `other` as feedback for refinement, missing demo clarity, missing docs clarity, Storybook demo issues, or follow-up questions.
7. If I report `other` or `fail`, make the necessary code/story/docs refinements, run the required tests, then resume the same QA step.
8. Keep going until all QA steps pass.
9. Once all QA is validated on my side, create the appropriate conventional commit(s):
   - use a concise subject
   - include a short body explaining what was done
   - if there are clearly separate concerns, split them into more than one commit
10. After that, make the branch review-ready:
   - make sure the branch is attached if the worktree is on a detached `HEAD`
   - merge `origin/main` into the branch
   - resolve conflicts carefully
   - run the required checks again
   - if merging `main` introduces dependency, lint, test, or build issues, fix them as part of branch prep
11. After the merge-from-main step, update release metadata if appropriate for the branch:
   - package version bumps
   - changelog entries
   - release/versioning docs if this repo expects them
12. Re-run final validation after those release metadata changes:
   - `npm test`
   - `pnpm lint`
   - any package-specific build checks that are relevant, especially Storybook if React/docs were touched
13. If any lint/build/test issue appears during the review-ready stage, fix it and explain clearly:
   - what the failure was
   - whether it came from this branch, from merging `main`, or from local dependency drift
   - what you changed to resolve it
14. Once the branch is fully ready, draft:
   - a PR title
   - a PR description in the style of previous PRs in this repo, especially PRs `#166`, `#170`, `#172`, and `#173`
15. Do not push. Give me the exact `git push` command(s) to run manually.

Important constraints:
- Run `npm test` after modifying JavaScript or TypeScript files.
- Run `pnpm lint` before considering the branch ready to push.
- Prefer minimal, surgical changes.
- Keep toolkit and React parity in scope.
- If Storybook examples are misleading or make validation harder, improve them.
- If docs/examples are missing what is needed to validate behaviour, improve them too.
- When manual QA needs it, include exact docs/example URLs and exact Storybook story/doc URLs.
- Do not skip the interactive QA flow. I want to validate step by step with you before the commit and PR draft.
- If merging `main` introduces new dependencies, sync/install them and verify the branch still passes lint/build/test.
- If the repo uses version bumps/changelog updates as part of component PRs, include those so the PR is fully review-ready rather than code-only.
- Leave unrelated modified or untracked files alone unless I explicitly ask you to include them.
- At the end, summarize:
  - the main functional changes
  - any post-merge fixes
  - the exact checks run
  - the exact commit(s) created
  - the exact push command(s)

Output style I want from you:
- Be practical and direct.
- Give me exact URLs for QA.
- Drive the QA one step at a time.
- When something fails, explain it plainly and fix it before moving on.
- Keep PR drafts concise but complete, matching the style of the existing repo PRs.
```

---

## Notes

- This template is intentionally focused on branch validation and review-readiness, not initial component implementation planning.
- Use the separate component update template when you need the full Figma-analysis and implementation workflow from scratch.
