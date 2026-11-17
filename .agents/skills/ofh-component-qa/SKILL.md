---
name: ofh-component-qa
description: Walk a contributor through one-step-at-a-time manual QA of an OFH design-system component branch against Figma, site docs and Storybook.
---

# OFH component QA

Use after implementation and an agent check of the actual diff, rendered behavior and relevant tests, before merge readiness. In a full contribution, follow the [contribution workflow](../ofh-design-system-contribution/SKILL.md). Read the official-plugin [Figma evidence guide](../ofh-design-system-contribution/references/figma-evidence.md) when comparing design behavior.

Inspect the current diff across toolkit, React, docs/examples, Storybook and tests. Summarize practical UI changes and an agent-side token conformance result for **every affected public surface**: typography, spacing/icon gaps, state colours, static versus responsive identity, intentional versus accidental inherited styles, and remaining `must fix before QA` gaps. A relevant unresolved gap prevents that affected QA claim; continue independent checks where possible.

Build a short QA sequence with exact local site/example and Storybook Docs/story URLs, Figma comparison evidence, actual viewport or container widths, themes, states and breakpoint-specific expectations. For each step state what changed, exact observable value/behavior and token where known, why it is expected, how to inspect it (including the element/class and relevant parent or child computed style), and what counts as pass. Include keyboard/assistive technology checks, docs and Storybook teaching parity, and copyable examples where relevant. If exact values are unknown, say so and give an objective check instead of guessing. Mechanical lint/tests/builds do not prove visual alignment.

Give **one step**, then wait for the contributor's `pass`, `fail - ...`, or `other - ...`. Treat `other` as feedback or a question, not approval. Do not advance on silence or simulate human review. On failure, agree any material fix scope with the contributor, make the change, inspect the new diff and rendered behavior, run relevant checks, then repeat that QA step. Re-run targeted tests and applicable lint/builds for touched surfaces. Temporary QA-only changes must be identified and removed before moving on.

After every step has a real pass, summarize what the contributor validated, fixes, commands actually run, remaining risks, and whether merge readiness can start. Do not create commits or PR text during QA unless the contributor asks.
