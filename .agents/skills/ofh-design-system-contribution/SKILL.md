---
name: ofh-design-system-contribution
description: Guide an OFH design-system component contribution from discovery through implementation, human QA and review preparation. Use for shared components or shared fixes in this repository.
---

# OFH design-system contribution

Start in the repository root. One agent and contributor can work through all stages in one conversation; the stage skills hold their detailed instructions. Read [contributor prerequisites](../../../docs/contributing/ai-contribution-prerequisites.md) when helping someone start on a new machine or account.

## Choose a starting route

- For a ready-for-development DSE ticket, ask the contributor for its requirements or a safe excerpt, Figma node links, and any related work. Do not assume Jira access from a URL.
- For a squad need without a ready ticket, first invite a brain dump. Reflect the problem back, then ask one targeted question at a time about users and use cases, expected behavior, constraints and what should be reusable. Compare existing components. With the contributor, assess whether this calls for an existing component update, a new shared component, or a squad-specific solution. If it looks like a shared candidate, draft brief requirements and open questions, then guide the contributor to `#design-system` or the Thursday meeting for support, scoping and approval. Do not post for them or imply agent approval. No ticket or Figma link is needed for this first conversation; implementation still needs agreed design and scope.

Shared fixes can be narrower than new components. Agree the review unit and observable success criteria with the contributor. Record the intended base, affected toolkit/React/site surfaces, dependencies, assumptions, open decisions, and what evidence will verify the result.

## Stages

1. Start with the contributor's need. Once design-backed work is ready, use [component analysis](../ofh-design-system-component-analysis/SKILL.md) to inspect Figma and current code, report findings one by one, and agree scope before implementation. Ask the contributor about material design, scope or public API choices before coding.
2. Implement the agreed scope using the [implementation reference](../ofh-design-system-component-analysis/references/implementation.md) for the component-specific quality bar.
3. Inspect the actual diff, rendered behavior and check results. Fix findings and recheck before human QA. This agent self-review is not an independent code review or contributor approval.
4. Use [component QA](../ofh-component-qa/SKILL.md) with the contributor, one pass/fail/other step at a time. Never infer approval from silence or agent-side checks.
5. After QA passes, use [merge readiness](../ofh-component-merge-readiness/SKILL.md) to report checks, Changeset status and blockers. Ask whether the contributor wants help with manual push or PR steps. No push, merge, tag, release or publication. A remote draft PR is only created when the contributor requests it.

At every stage, use the **official Figma plugin** and [Figma evidence guide](references/figma-evidence.md) for design reads. Check live tool capabilities. The presence of a plugin or its skills alone does not prove a particular read/write API is available. Follow any plugin skill that is mandatory before its tool; the shared workflow does not require personal skills or a separate Figma Desktop server.

The repository [contribution guide](../../../docs/contributing/ai-assisted-contributions.md) explains the contributor-facing route. Stage skill instructions are the source of truth for agent behavior.
