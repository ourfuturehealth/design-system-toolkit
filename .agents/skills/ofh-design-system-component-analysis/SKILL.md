---
name: ofh-design-system-component-analysis
description: Analyze an OFH design-system component or shared fix against Figma and current toolkit, React and docs behavior before implementation.
---

# OFH component analysis

Use before implementing a shared component or fix. The [contribution skill](../ofh-design-system-contribution/SKILL.md) connects this analysis with implementation, QA and review preparation.

For an unscoped squad need, start with the conversation in the [contribution skill](../ofh-design-system-contribution/SKILL.md); no ticket or Figma link is needed for that first discussion. For design-backed analysis, read the official-plugin [Figma evidence guide](../ofh-design-system-contribution/references/figma-evidence.md). Confirm the agreed need, available Figma node links, relevant dependencies and intended base. Inspect repository patterns and the existing toolkit, React, site, Storybook and consumer behavior relevant to this review unit. Do not infer requirements from a ticket URL alone.

Produce a short comparison of intended behavior, current behavior, cause, consumer impact and recommendation. Include every public surface affected, not only the main example. For token alignment, record Figma token identity and static/responsive type, value at each relevant mode and width, current code primitive or computed inherited style, and `aligned`, `must fix before QA` or `acceptable inherited behavior`. Check typography, spacing (including invisible hit areas and icon gaps), icon size, borders, radius and state colours where relevant. Inspect `a`, `p`, `ul`, `li`, headings, body and reused primitives for accidental inherited margins or typography. Verify helper output in the browser when cascade or responsive behavior matters.

Audit nested public dependencies in both target surfaces as `ready`, `needs update`, `missing` or `blocking prerequisite`. Read a dependency directly in Figma when the parent context omits it. Do not create an internal stand-in for a missing shared dependency without an explicit, informed decision. A separate implementation may be useful as inspiration, but OFH Figma and current repository behavior govern the decision.

Present findings one at a time as `MUST FIX`, `SHOULD IMPROVE` or `NICE TO HAVE`, with evidence and concrete outcomes. Ask for a decision when ticket scope, design intent, dependency order, breaking behavior, or public API shape has multiple reasonable interpretations. Agree what is in the implementation unit and its verification signals before coding. Record unresolved Figma evidence precisely; do independent work when it does not depend on that gap. Read the [implementation reference](references/implementation.md) when scoping the implementation brief.
