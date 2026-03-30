# Component Validation QA Template Prompt

This template is for the interactive validation pass once a component branch is mostly implemented and you want to manually review the work step by step with the agent.

Use this prompt after the main implementation work is done, including the implementation prompt's mandatory documentation and Storybook UX pass, but before final commit cleanup and PR preparation.

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
- If relevant, related PRs or base-branch dependency: `[details]`

I want you to help me manually validate this branch before we move into final PR preparation.

Workflow I want you to follow:
1. Inspect the current implementation and current diff for this component across toolkit, React, docs/examples, Storybook, and tests.
2. Give me a concise "what changed" summary in practical terms so I know what I'm validating.
3. Build a manual QA script with:
   - exact docs/example URLs
   - exact Storybook docs/story URLs
   - a short pass/fail table
   - any Figma comparison notes I should keep in mind
   - any breakpoint-specific token expectations I should keep in mind for mobile / tablet / desktop
   - any Storybook ↔ docs-site example parity checks that should be validated manually
4. Then walk me through that QA script one step at a time.
5. After each step, stop and wait for my response in the format:
   - `pass`
   - `fail - ...`
   - `other - ...`
6. Treat `other` as feedback for refinement, missing demo clarity, missing docs clarity, Storybook demo issues, or follow-up questions.
7. If I report `other` or `fail`, make the necessary code/story/docs refinements, run the required targeted checks, then resume the same QA step.
8. Keep going until all QA steps pass.
9. Once all QA is validated on my side, summarize:
   - what was validated
   - any fixes made during QA
   - whether any temporary internal adapter or dependency workaround was introduced during implementation
   - any residual risks or follow-ups
   - whether the branch is ready for the PR-readiness prompt
10. Do not create final commits or PR text unless I explicitly ask for that in this session.

Important constraints:
- Run `npm test` after modifying JavaScript or TypeScript files.
- If Storybook examples are misleading or make validation harder, improve them.
- If docs/examples are missing what is needed to validate behavior, improve them too.
- Treat Storybook ↔ docs-site example gaps as implementation misses when one surface teaches materially less than the other.
- Treat misleading Storybook controls or vague prop documentation as implementation misses to be fixed before QA is considered complete.
- Treat raw JSON controls for stable nested props as implementation misses when the story could reasonably offer clearer text/select/boolean controls instead.
- Treat controls for values the component visibly ignores or overrides as implementation misses to be fixed before QA is considered complete.
- Treat responsive token mismatches or accidental inherited element styles (`p`, `ul`, `li`, `h*`, `a`) as implementation misses to be fixed before QA is considered complete.
- Treat React components that depend on toolkit progressive-enhancement classes such as `.js-enabled` for core interactive behavior as implementation misses to be fixed before QA is considered complete.
- Treat Storybook docs-page examples that share effective IDs or form names across stories and interfere with each other as implementation misses to be fixed before QA is considered complete.
- If implementation used a temporary internal adapter because a dependency was missing, call that out clearly during QA and include the affected surfaces in the validation script.
- Include exact URLs for every QA step.
- Keep the flow interactive. Do not skip ahead after giving me a step.
- Leave unrelated modified or untracked files alone unless I explicitly ask you to include them.
- At the end, summarize the exact checks run during QA refinements.

Output style I want from you:
- Be practical and direct.
- Give me exact URLs for QA.
- Drive the QA one step at a time.
- When something fails, explain it plainly and fix it before moving on.
- Keep the summary concise and useful for handing off into PR-readiness work.
```

---

## Notes

- This template is intentionally focused on human-in-the-loop validation.
- Use `component-pr-readiness-template-prompt.md` after this when you want the final cleanup, release-doc refresh, commits, and branch handoff.
