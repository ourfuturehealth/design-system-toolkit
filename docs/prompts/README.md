# Prompt Workflows

Use these prompts as a staged workflow when updating a component.

## Recommended Order

1. `component-update-template-prompt.md`
   Use for the full implementation workflow: Figma analysis, toolkit work, React parity, tests, Storybook, and documentation.
2. `component-validation-qa-template-prompt.md`
   Use once implementation is mostly done and you want an interactive manual QA pass with exact URLs and step-by-step validation.
3. `component-pr-readiness-template-prompt.md`
   Use after QA passes, or when you want the final repo-wide cleanup, release-doc refresh, commit prep, and branch handoff.

## Why These Are Separate

The implementation prompt and the two finish-up prompts ask the agent to work in different modes:

- implementation work should stay focused on design analysis and code changes
- interactive QA should pause after each step and wait for pass/fail feedback
- PR-readiness work should keep moving and clean up repo-wide surfaces without stopping after every check

Keeping them separate makes the workflow easier to follow and reduces prompt ambiguity.
