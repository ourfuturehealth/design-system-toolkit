# Figma evidence for component work

Use the official Figma plugin. Check the tools available in the current session and what their responses contain. Plugin installation, skill discovery and an open desktop app are not evidence that a particular operation works. Tool names may contain `MCP`; provider identity, not the protocol label, determines whether the tool belongs to the official plugin. Follow `figma-design-to-code` before `get_design_context` and `figma-use` before `use_figma` when those tools are available.

Get the component node, a screenshot, design context, exposed variant nodes, variable bindings and resolved values. Read each relevant variant and state when exposed. Read a nested dependency directly when its parent response omits its detail. Inspect visual output as well as metadata.

For responsive findings, keep an evidence row for each relevant subelement and state:

| Component variant | Variable mode (explicit or inherited) | Frame/container width | Child binding | Screenshot/context/token value | Code value and source | Status |
| --- | --- | --- | --- | --- | --- | --- |

Separate a named component variant from the variable mode. Record whether the mode was explicitly set on the node or inherited, and the actual frame or container width. If the API does not expose mode inheritance or a child's binding, mark that cell `unknown`; ask for the specific Figma panel evidence when the distinction affects implementation. Do not infer it from appearance or labels. A variant name, mode label, or screenshot at one fixed width does not establish mobile/tablet/desktop behavior. Compare the bound token identity, its resolved value at each relevant mode/width, and rendered code at corresponding widths. Same numeric value does not make a static token equivalent to a responsive token.

If the plugin cannot set modes, variants or widths programmatically, ask the contributor to change **one specific control at a time** in Figma and capture before/after readbacks and screenshots. Do not describe a manual change as agent-controlled. If `use_figma` becomes available for exploratory edits, use its required plugin skill. Prefer a user-authorised isolated temporary copy, preserve the designer original, and clean up the copy; never modify the original as an inspection shortcut.

Collection identities and bound/resolved values do not expose every `valuesByMode`, alias target or collection entry. Inspect those only if live tools expose them, or request the smallest export/excerpt needed for a token decision. A whole collection export is not a prerequisite for ordinary component work when existing evidence is sufficient. If an important read is unavailable, ask for the smallest specific screenshot, Figma setting or token excerpt; label the affected conclusion unresolved. Unrelated gaps do not block independent work, but relevant gaps block the affected implementation. Never guess token values.
