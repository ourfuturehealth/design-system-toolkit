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
   - exact statements of what changed in code and what that means in the rendered UI
   - explicit size/spacing/token values I should be validating wherever they are knowable
   - the exact token names involved, and whether each one is static or responsive
   - the before/after expectation when the QA is validating a recent change
   - the exact reason those values are expected, not just a vague design note
   - the exact element/class I should inspect in DevTools when visual validation is not enough
   - any shared primitive or layout-object classes whose computed margins/gaps should also be inspected because they might still be affecting the rendered result
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
- Treat Storybook docs pages that mix story-only helper args into the real React API as implementation misses to be fixed before QA is considered complete.
- Treat Storybook surfaces that do not clearly separate `Docs`, `Default`, `Builder`, and fixed showcase stories as implementation misses unless there is a strong reason for a different shape.
- Treat raw JSON controls for stable nested props as implementation misses when the story could reasonably offer clearer text/select/boolean controls instead.
- Treat controls for values the component visibly ignores or overrides as implementation misses to be fixed before QA is considered complete.
- Treat copyable example snippets that hide structured prop shapes behind undeclared variables as implementation misses when that makes the API harder to follow.
- Treat responsive token mismatches or accidental inherited element styles (`p`, `ul`, `li`, `h*`, `a`) as implementation misses to be fixed before QA is considered complete.
- Treat spacing or typography contributed by reused shared primitives or layout objects (`label`, `hint`, `error-message`, `fieldset`, `form-group`, list wrappers, etc.) as implementation misses when they make the rendered output diverge from Figma.
- Treat React components that depend on toolkit progressive-enhancement classes such as `.js-enabled` for core interactive behavior as implementation misses to be fixed before QA is considered complete.
- Treat Storybook docs-page examples that share effective IDs or form names across stories and interfere with each other as implementation misses to be fixed before QA is considered complete.
- Treat hard-to-follow nested ternaries or compressed logic as implementation misses when the same behavior can be expressed more clearly with explicit conditionals or small helper variables.
- If implementation used a temporary internal adapter because a dependency was missing, call that out clearly during QA and include the affected surfaces in the validation script.
- Do not use vague instructions like "looks shorter" or "feels closer to Figma" when the expected result can be stated precisely.
- Do not describe spacing or typography only by numeric values when token identity matters; say whether the implementation should be using a responsive helper or a static token.
- When validating Storybook docs, check that the Docs page teaches the real React API in plain language:
  - what the actual props are
  - what they do
  - what shape they take
  - which controls are Storybook-only helpers rather than real component props
- For each QA step, prefer this structure:
  - what changed
  - what exact values or behaviors should now be visible
  - why those values/behaviors are expected
  - how to inspect them if needed
  - what counts as pass
- If exact values are not knowable, say that plainly and explain what can be validated objectively instead.
- When a component composes older shared primitives, inspect the computed margins/gaps on both the wrapper container and the child primitives instead of trusting source-level resets.
- If you introduce a temporary QA-only tweak to make inspection easier, call it out explicitly, keep it minimal, and revert it before moving on.
- Include exact URLs for every QA step.
- Keep the flow interactive. Do not skip ahead after giving me a step.
- Leave unrelated modified or untracked files alone unless I explicitly ask you to include them.
- At the end, summarize the exact checks run during QA refinements.

Output style I want from you:
- Be practical and direct.
- Give me exact URLs for QA.
- Drive the QA one step at a time.
- Make each QA step specific enough that a reviewer can validate it without guessing what "good" looks like.
- Treat Storybook docs usability as part of the QA target, not a separate follow-up.
- When something fails, explain it plainly and fix it before moving on.
- Keep the summary concise and useful for handing off into merge-readiness work.
```

---

## Notes

- This template is intentionally focused on human-in-the-loop validation.
- Use `component-pr-readiness-template-prompt.md` after this when you want the final merge-readiness pass: cleanup, release-doc refresh, commits, PR metadata, and branch handoff.
