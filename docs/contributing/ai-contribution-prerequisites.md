# Prerequisites for AI-assisted design-system contributions

Use Codex CLI from the repository root. The skills live in [`.agents/skills`](../../.agents/skills/ofh-design-system-contribution/SKILL.md); you do not need to copy them into your home directory. [Codex skills documentation](https://learn.chatgpt.com/docs/build-skills) explains repository discovery. If a personal skill has the same name, both may appear: choose the repository version.

## To start a conversation

1. [Install Codex CLI and sign in](https://learn.chatgpt.com/docs/cli) with your organisation-approved account. Run `codex --version` to check the install, open this repository as the working directory, then launch `codex`. Ask your workspace administrator if access is unavailable; never share login tokens or credentials with the agent.
2. Check that the active session can find `ofh-design-system-contribution` in the repository's `.agents/skills` and read its `SKILL.md`. If it is missing, update the checkout or restart Codex from the repository root. A file on disk alone does not prove this session loaded it.
3. For a ready-for-development DSE ticket, bring its requirements and Figma node links. For a squad idea, a rough description is enough: the agent will help frame the need before a ticket or design exists. A Jira URL alone does not grant agent access; provide safe excerpts yourself.

## Before implementation

- Arrange repository access and the Git, Node and pnpm versions in [running locally](running-locally.md). Package installation may need the organisation's existing registry access. You can discuss an idea before installing dependencies.
- Agree the design and scope. Confirm you can read the relevant Figma file and nodes. In Codex CLI, check `/plugins` for the **official Figma plugin** and ask the agent which reads actually work. This workflow does not require a separate Figma Desktop MCP server or editing access. If a design read is unavailable, provide the smallest screenshot, node setting or token excerpt requested; relevant unknowns remain unresolved until there is enough evidence to implement that part.
- If the Figma account connection cannot be completed in Codex CLI, open ChatGPT in a browser and go to **left sidebar → Plugins → Figma → Settings → Connect**. Sign in with your organisation-approved Figma account, return to CLI `/plugins`, and ask the agent to test a design read. Seeing the plugin in CLI alone does not confirm that the connection works.

## Before manual QA and PR handoff

Run the relevant local site and Storybook views. GitHub contribution and PR permissions are needed for the eventual review handoff, not the first conversation. Do not paste private documents, credentials or sensitive participant data into the chat.
