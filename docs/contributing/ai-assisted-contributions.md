# AI-assisted component contributions

These repository skills help contributors make shared components and shared fixes across the toolkit, React library and docs. You remain responsible for scope and design decisions, manual QA, code review and the final PR. Read the [prerequisites](ai-contribution-prerequisites.md) first.

## Start with the right context

For a DSE ticket marked ready for development, bring its requirements, Figma component node and dependency links, and related PR/base information. For a squad need without a ready ticket, start by telling the agent what is happening in your own words. It will ask focused questions one at a time, check existing design-system options with you, and help work out whether the need is a shared fix, a new component or something specific to your squad. If it looks like a shared candidate, it will draft a short proposal and open questions for you to take to `#design-system` or the Thursday meeting. The design-system team helps scope and approve it; the agent does not contact them or decide acceptance.

From the repository root in Codex CLI, start with:

```text
Use $ofh-design-system-contribution. I have a ready DSE ticket. Here are its requirements and Figma node: ...
```

Or start with an unscoped idea:

```text
Use $ofh-design-system-contribution. Our squad keeps running into this UI problem: ... Help me work out whether it belongs in the design system.
```

For a narrower stage, use `$ofh-design-system-component-analysis`, `$ofh-component-qa`, or `$ofh-component-merge-readiness`. The [entry skill](../../.agents/skills/ofh-design-system-contribution/SKILL.md) routes the full process. You do not need to paste a large prompt or install personal skills. The agent checks live official Figma plugin capabilities and asks for a specific manual read when needed; it does not guess token values.

Once a shared change has an agreed design, the agent maps current behavior and design evidence with you, then agrees scope and success criteria before coding. It implements the agreed change, checks the actual diff, rendered behavior and test results, and fixes findings before manual QA. This agent check does not replace human code review. You can do the whole workflow in one conversation. Validate one site/Storybook/Figma step at a time with `pass`, `fail - ...` or `other - ...`; merge readiness follows only after your QA passes.

For public package changes, the feature branch includes a [Changeset](../../.changeset/README.md) with affected packages and consumer guidance. Package versions and future changelog entries are generated later by the release flow. At readiness, the agent reports the checks and remaining limitations, then asks if you want help with manual push or PR steps. It does not push or merge. It opens a draft PR only when you request one and leaves it in draft until you authorize review.
