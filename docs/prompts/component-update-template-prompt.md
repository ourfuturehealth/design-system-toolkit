# Component Update Template Prompt

This template provides a complete workflow for updating/creating design system components. It aligns Figma design specs with toolkit implementation (HTML/Nunjucks/SCSS) and React library components.

Follow this with the dedicated finish-up prompts:

- `component-validation-qa-template-prompt.md` for interactive manual QA
- `component-pr-readiness-template-prompt.md` for final cleanup, release-doc refresh, commits, and PR prep

---

## 📋 How to Use This Template

**For human operators:**

1. **Copy the entire prompt** from the ✂️ cut line below through the end of the file
2. **Replace all `{PLACEHOLDERS}`** with actual values:
   - `{COMPONENT_NAME}` → e.g., "Button", "TextInput", "Card"
   - `{component-name}` → e.g., "button", "text-input", "card"
   - `{ComponentName}` → e.g., "Button", "TextInput", "Card"
   - `{JIRA_TICKET_ID}` → Your ticket number (e.g., "DSE-263")
   - Paste full JIRA content into the designated section
   - `{Figma URL with node-id}` → Full Figma link with node-id parameter
3. **Paste into your AI agent** (GitHub Copilot, Claude, etc.)
4. The agent will follow the structured workflow automatically

**💡 Best Practice:** Keep this file as your master template. Don't create component-specific files.
After implementation is mostly done, move to the dedicated validation and PR-readiness prompts instead of trying to do everything in one long session.
This workflow also includes a temporary external-reference audit against the BSM React repo to speed up component work while OFH React coverage is still catching up. Once OFH React reaches comparable coverage, stop relying on that external repo.

---

**✂️ COPY EVERYTHING BELOW THIS LINE FOR YOUR AGENT PROMPT**

---

## Component Update: {COMPONENT_NAME}

### Context

- **JIRA Ticket ID:** {JIRA_TICKET_ID}
- **JIRA Requirements/Notes:**
  ```
  {Paste the JIRA ticket description, acceptance criteria, and design notes here}
  ```
- **Figma Component:** {Figma URL with node-id}
- **Dependency Figma Components:** {optional Figma URLs for any dependent components that may need auditing, for example Tag, Button, Inset text}
- **External React Reference Repo:** `https://github.com/ourfuturehealth/biosample-management-system/tree/main`
- **External Reference Paths:** `apps/bsm-storybook`, `packages/components`
- **Related PRs:** {any dependencies or related work}

---

## Objectives

1. Analyze current toolkit implementation vs Figma design
2. Implement/update toolkit component (HTML/Nunjucks/SCSS/JS) and polish it
3. **Ensure React component exists** and reaches feature/functional parity with toolkit (create if missing)
4. Create/update comprehensive Storybook documentation
5. Create/update comprehensive docs-site examples so toolkit docs and Storybook teach the component equally well
6. Add automated tests (functional + accessibility)
7. Update all relevant documentation

---

## Analysis Phase

### 1. Figma Analysis (Use Figma MCP)

- Fetch component details from Figma node
- Document design specifications:
  - Variants/states available
  - Spacing/sizing tokens used
  - Color tokens and themes
  - Typography tokens
  - Interactive states (hover, focus, active, disabled)
  - Accessibility annotations
- Build a **token translation table** for the component before implementation:
  - list each meaningful subelement (container, header/label, body, list, helper text, link/action, icon gap, hit target, etc.)
  - record the exact Figma token used for spacing, typography, radius, border, and icon sizing
  - mark each token as `static` or `responsive`
  - record the actual mobile / tablet / desktop values when the token is responsive
- Do not assume that a same-number static token is equivalent to a responsive Figma token
  - example: `ofh/space/vertical/16` is **not** automatically the same as `$ofh-size-16`
  - example: `paragraph/md` in Figma should map to the responsive typography mixin, not rely on inherited browser or global text styles

### 2. Current Implementation Review

**Toolkit (`packages/toolkit/components/{component-name}/`):**

- Review `template.njk` - markup structure
- Review `macro.njk` - parameter API
- Review `_{component-name}.scss` - styling and variants
- Review `{component-name}.js` (if exists) - behavior
- Review `README.md` - documentation completeness
- Review `tests/integration/{component-name}.test.js` (if exists)
- Review how the component interacts with **global semantic element styles**
  - check `p`, `ul`, `ol`, `li`, `h1-h6`, `a`, `button`, and similar elements used inside the component
  - identify where the component is intentionally relying on global typography or list spacing
  - identify where those inherited styles must be overridden to match Figma exactly

**React (`packages/react-components/src/components/{ComponentName}/`):**

- Check if component exists
- **If exists:** Review implementation against toolkit parity - note all discrepancies
- **If missing:** This is a REQUIRED deliverable - you MUST create the React component
- React component must achieve full feature and behavior parity with toolkit
- React API does not need to mirror toolkit/macro API exactly if a more idiomatic and simpler React API would be clearer for consumers
- Both versions should support the same user-facing capabilities, variants, and behaviors
- Do not carry toolkit progressive-enhancement mechanisms into React when React state should own the behavior directly
  - example: toolkit may rely on a global `.js-enabled` class to hide unrevealed conditional content
  - React components must not depend on `.js-enabled` or similar page-level enhancement flags for core behavior
  - if a section is conditionally revealed in React, hide or show it directly from component state and rendered attributes

### 3. External React Reference Audit (MANDATORY, TEMPORARY)

Inspect the BSM React repo before implementing or reshaping the React version of this component:

- Repo: `https://github.com/ourfuturehealth/biosample-management-system/tree/main`
- Storybook path: `apps/bsm-storybook`
- Component path: `packages/components`

**Purpose of this step:**

- Speed up delivery while OFH React coverage is still behind toolkit
- Check whether another OFH-adjacent implementation already solved part of the React API, structure, tests, or Storybook docs
- Reuse only what helps without weakening OFH consistency

**What to inspect:**

- Look for the same component, a close analogue, or a shared dependency in `packages/components`
- Look for the corresponding stories and docs patterns in `apps/bsm-storybook`
- If the component uses icons or related affordances, inspect whether BSM has a reusable React icon pattern that is relevant

**Decision rules (MANDATORY):**

- OFH Figma, current OFH toolkit, and current OFH mainline patterns remain the source of truth
- Treat BSM as a temporary acceleration source only, not as gospel
- Prefer consistency of OFH implementation patterns and Storybook/docs behavior over copying quickly
- Do not copy BSM code blindly if it conflicts with OFH Figma, toolkit semantics, naming, iconography, or better OFH docs conventions
- If BSM is missing the component, stale, or not useful, ignore it and continue
- Once OFH React reaches comparable component coverage, stop relying on BSM and remove this dependency from day-to-day workflow

**Output required from this step:**

- `useful to reuse`
- `useful as inspiration only`
- `reject because it conflicts with OFH`

For each relevant finding, state what was useful and why, or why it should be rejected.

### 4. Dependency & Prerequisite Audit

Identify any design-system components or shared primitives this component depends on in toolkit, React, docs/examples, or Storybook.

- Audit direct dependencies such as Tag, Button, Inset text, Error message, Icon, or any other reusable design-system component used inside this component
- For each dependency, determine whether it:
  - exists in toolkit and is visually up to date with Figma
  - exists in React and is ready to be reused
  - exists in one surface but not the other
  - is a public design-system component or just an internal implementation detail
- If you need a dependency's own Figma reference to judge whether it is up to date, ask the user for that Figma URL before implementation
- Categorize each dependency as:
  - `ready`
  - `needs update`
  - `missing`
  - `blocking prerequisite`

**Dependency sequencing rule (MANDATORY):**

- If this component depends on another public design-system component that is missing or not ready in the target surface, surface that clearly before implementation
- Recommend updating the dependency first
- Do not silently create an internal stand-in for a missing public component unless the user explicitly approves that as a temporary exception

### 5. Gap Analysis

Compare Figma ↔ Toolkit ↔ React:

- Missing variants or states
- Design token mismatches (colors, spacing, typography)
- Accessibility requirements not met
- API inconsistencies
- React API simplification opportunities where toolkit-style class or macro APIs could become clearer semantic props
- Documentation gaps

### 6. Design Token & Pattern Alignment (MANDATORY)

**This step is REQUIRED, not optional. Do not skip even if the JIRA ticket is narrow in scope.**

Review the entire component implementation against design system standards:

**Figma Visual Comparison (MANDATORY FIRST STEP):**

- [ ] **Fetch Figma screenshot** using `mcp_figma_get_screenshot` with the component node ID
- [ ] **Compare ALL variants** in Figma vs. implementation:
  - Default state visual appearance
  - Hover state (if applicable)
  - Focus state (outline color, width, offset, border-radius)
  - Active/pressed state (if applicable)
  - Disabled state (if applicable)
  - Error state (if applicable)
  - All variant combinations (e.g., primary, secondary, outlined, text, ghost)
- [ ] **Check variant-specific overrides** - Do certain variants have different specs?
  - Example: Text buttons may have different padding than contained buttons
  - Example: Inverted variants may need different focus colors (white vs. blue)
  - Example: Some variants may have squared corners while others are rounded
- [ ] **Compare interactive state details**:
  - Focus outline border-radius matches button border-radius relationship
  - Inverted variants use inverted focus colors (white on dark bg)
  - Hover states change correct properties (color, background, border)
  - Active states are visually distinct from focus states
- [ ] **Document design spec vs. code discrepancies** before any implementation

**Design Tokens Audit:**

- [ ] All hardcoded colors → Check against `$ofh-color-*` tokens
- [ ] All hardcoded spacing → Check against `$ofh-size-*` tokens or `ofh-spacing()` function
- [ ] All hardcoded typography (font-size, line-height, font-weight) → Check if `@include ofh-typography-responsive()` can be used
- [ ] All border-radius values → Check against `$ofh-radius-*` tokens
- [ ] All border widths → Check against `$ofh-stroke-weight-*` tokens
- [ ] All shadow values → Check against `$ofh-shadow-*` tokens
- [ ] For every spacing and typography token in Figma, map it to the **correct code primitive**:
  - responsive spacing helper
  - responsive typography mixin
  - static size token
  - iconography token
- [ ] Do not replace responsive Figma tokens with same-number static tokens just because the desktop value matches
- [ ] Audit invisible layout/hit-area spacing too, not just visible padding and icon size
- [ ] Audit semantic-element inheritance:
  - check whether global `ul > li`, `p`, `h*`, or link styles are adding margins/typography the component did not ask for
  - add explicit overrides when Figma requires component-specific spacing or typography

**Responsive Pattern Audit:**

- [ ] Manual media queries for spacing → Check if `@include ofh-responsive-padding/margin()` can be used
- [ ] Manual media queries for typography → Check if responsive typography mixin handles this
- [ ] Inconsistent breakpoint usage → Check against `$ofh-breakpoints`
- [ ] When a responsive helper **cannot** express the exact Figma values, document why and use explicit breakpoint rules intentionally
- [ ] Verify every responsive token hotspot at mobile, tablet, and desktop instead of only checking the desktop screenshot

**Focus State Audit:**

- [ ] Manual `outline` declarations → Check if `@include ofh-focused-button()` or similar mixin exists
- [ ] **Verify mixin produces correct visual output** (don't just check if mixin is used)
- [ ] **Check for variant-specific focus overrides** that may break visual design (e.g., `border-radius: 0` in focus state)
- [ ] **Inverted variants use inverted focus tokens** (`$ofh-color-border-feedback-focus-inverted` for white outline)
- [ ] Inconsistent focus indicators → Standardize across all interactive elements

**Accessibility Audit:**

- [ ] Missing ARIA attributes for component state
- [ ] Keyboard navigation support (Tab, Enter, Space, Arrows where appropriate)
- [ ] Color contrast ratios meet WCAG 2.1 AA
- [ ] Focus indicators meet WCAG 2.1 AA (2px minimum, sufficient contrast)
- [ ] React behavior does not depend on toolkit progressive-enhancement classes such as `.js-enabled`
- [ ] React conditional reveals and other JS-driven states are controlled directly by React state, not by page-level enhancement flags

**Code Quality Opportunities:**

- [ ] Duplicated code that could be abstracted into mixins
- [ ] Overly specific selectors that could be simplified
- [ ] Unused CSS rules or dead code
- [ ] Inconsistent naming patterns
- [ ] Missing or outdated comments

**Output Required:**

1. Create a **comprehensive list** of all findings (not just JIRA ticket items)
2. Categorize as: **MUST FIX** (breaks design system) vs. **SHOULD IMPROVE** (quality/consistency) vs. **NICE TO HAVE** (future enhancement)
3. Include the **dependency audit results**, clearly identifying any dependency that is `needs update`, `missing`, or a `blocking prerequisite`
4. **Present this analysis to the user BEFORE implementing** and ask:
3. Include the **external React reference audit results**, clearly stating what from BSM is worth reusing, what is inspiration only, and what should be rejected
4. Include the **dependency audit results**, clearly identifying any dependency that is `needs update`, `missing`, or a `blocking prerequisite`
5. **Present this analysis to the user BEFORE implementing** and ask:
   - "Should I implement the JIRA ticket only, or include the MUST FIX items as well?"
   - "If there is a blocking prerequisite dependency, should I pause this component and update that dependency first, or proceed with an explicitly temporary internal adapter?"

---

## Implementation Phase

**IMPLEMENTATION ORDER (MANDATORY):**

0. **Blocking Dependencies First:** If the dependency audit surfaced a blocking prerequisite, update that dependency first unless the user explicitly approves a temporary internal adapter
1. **Toolkit First:** Update toolkit component (HTML/Nunjucks/SCSS/JS) with all changes
2. **Polish Toolkit:** Test, refine, ensure it works perfectly and matches Figma
3. **React Second:** Create/update React component to match polished toolkit
4. **Verify Parity:** Both versions support the same variants, behavior, and functionality, while React keeps an idiomatic, easy-to-use API
3. **React Second:** Create/update React component to match polished toolkit, informed by the BSM reference audit where useful
4. **Verify Parity:** Both versions support the same variants, behavior, and functionality, while React keeps an idiomatic, easy-to-use API

### 1. Toolkit Component Update

**Files to modify/create:**

- `packages/toolkit/components/{component-name}/template.njk`
- `packages/toolkit/components/{component-name}/macro.njk`
- `packages/toolkit/components/{component-name}/_{component-name}.scss`
- `packages/toolkit/components/{component-name}/{component-name}.js` (if interactive)
- `packages/toolkit/components/{component-name}/README.md`

**Requirements:**

- ✅ Match Figma design exactly
- ✅ Use design tokens from `core/settings/`
- ✅ Follow BEM naming with `.ofh-` prefix
- ✅ Support participant and research themes
- ✅ Include all variants and states from Figma
- ✅ Proper ARIA attributes and keyboard navigation

### 2. React Component Implementation (MANDATORY)

**This is REQUIRED, not optional. If the React component doesn't exist, you must create it.**

**Files to create/modify:**

- `packages/react-components/src/components/{ComponentName}/{ComponentName}.tsx`
- `packages/react-components/src/components/{ComponentName}/{ComponentName}.test.tsx`
- `packages/react-components/src/components/{ComponentName}/{ComponentName}.stories.tsx`
- `packages/react-components/src/components/{ComponentName}/{ComponentName}.module.scss` (if needed)
- `packages/react-components/src/components/{ComponentName}/index.ts`
- `packages/react-components/src/index.ts` (add exports)

**Requirements:**

- ✅ **Component must exist** - create from scratch if missing
- ✅ Review the BSM repo first for reusable implementation and Storybook patterns, but only adopt what still matches OFH Figma, toolkit, and current mainline conventions
- ✅ TypeScript with strict mode
- ✅ Extend appropriate HTML element props interface
- ✅ **Match toolkit functionality and capability** - same supported variants, same behavior, same element selection logic where relevant
- ✅ Prefer a **simple, idiomatic React API** over a strict mirror of toolkit macro/class APIs
- ✅ For common visual options, prefer semantic React props such as `variant`, `tone`, `status`, `size`, or similar clear names instead of requiring raw toolkit modifier classes
- ✅ Internally map React props to toolkit classes where needed
- ✅ Do not require consumers to know toolkit class names for common usage when a clearer React prop can express the same thing
- ✅ Reuse toolkit CSS classes (`.ofh-{component}`, `.ofh-{component}--{variant}`)
- ✅ Native ref for React 19+
- ✅ Export component and type interfaces
- ✅ Follow toolkit's element selection logic (e.g., Button with href renders as `<a>`)
- ✅ All toolkit variants must be supported in React (no subset)
- ✅ Keep `className` as the standard escape hatch for additional classes; only expose a separate toolkit-style `classes` prop if there is a strong, explicit reason

**Component Pattern (React 19+ with native ref):**

```tsx
// For simple components with single element type:
export interface {ComponentName}Props
  extends Omit<React.{ElementType}HTMLAttributes<HTML{ElementType}Element>, 'ref'> {
  /**
   * Visual style variant
   */
  variant?: 'variant1' | 'variant2' | 'variant3';
  /**
   * Ref forwarding for the underlying element
   */
  ref?: React.Ref<HTML{ElementType}Element>;
  // Additional semantic props from Figma/toolkit capabilities
}

export const {ComponentName} = ({
  variant = 'variant1',
  className = '',
  ref,
  ...props
}: {ComponentName}Props) => {
  const classes = [
    'ofh-{component}',
    `ofh-{component}--${variant}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <{element}
      ref={ref}
      className={classes}
      {...props}
    />
  );
};

{ComponentName}.displayName = '{ComponentName}';
```

**For components with conditional element rendering** (e.g., Button with href → `<a>` vs `<button>`), use discriminated unions. See [Button.tsx](../react-components/src/components/Button/Button.tsx) for the pattern:

```tsx
// Base props shared between variants
interface Base{ComponentName}Props {
  variant?: 'variant1' | 'variant2';
  children: React.ReactNode;
}

// Button element variant
interface ButtonElementProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'ref'>,
    Base{ComponentName}Props {
  ref?: React.Ref<HTMLButtonElement>;
}

// Anchor element variant (when href provided)
interface AnchorElementProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'ref'>,
    Base{ComponentName}Props {
  href: string;
  ref?: React.Ref<HTMLAnchorElement>;
}

export type {ComponentName}Props = ButtonElementProps | AnchorElementProps;

export const {ComponentName} = ({
  variant = 'variant1',
  className = '',
  children,
  ref,
  ...props
}: {ComponentName}Props) => {
  const classes = [
    'ofh-{component}',
    `ofh-{component}--${variant}`,
    className,
  ].filter(Boolean).join(' ');

  // Conditional element rendering with proper ref casting
  if ('href' in props && props.href) {
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        className={classes}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={classes}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
};

{ComponentName}.displayName = '{ComponentName}';
```

**React API design rule (MANDATORY):**

- Feature parity with toolkit is required, but React prop names do **not** need to match toolkit or Nunjucks macro names exactly
- Prefer idiomatic React APIs that are easy to read and easy to use
- Examples:
  - Prefer `<Tag variant="brand" />` over `<Tag classes="ofh-tag--brand" />`
  - Prefer `children` over macro-style `text`/`html` props when that is the clearer React pattern, unless rich HTML handling or another constraint makes a different API more appropriate
- If there are multiple reasonable React API shapes, briefly present the tradeoffs and ask the user for steer before locking one in
- Document the mapping between the React API and toolkit classes/variants in Storybook/docs when useful for maintainers

### 3. Testing Implementation

**Toolkit Tests (`packages/toolkit/tests/integration/`):**

- Test component initialization
- Test JavaScript behavior (if applicable)
- Test conditional logic
- Test DOM manipulations

**React Tests (co-located with component):**

- Rendering with different props/variants
- User interactions (clicks, keyboard, form submission)
- Accessibility (automated with vitest-axe)
- ARIA attributes and roles
- Keyboard navigation
- Focus management

**Accessibility Test Pattern:**

```tsx
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

it('should have no accessibility violations', async () => {
  const { container } = render(<Button>Click me</Button>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

it('should be keyboard accessible', async () => {
  const user = userEvent.setup();
  render(<Button>Click me</Button>);
  await user.tab();
  expect(screen.getByRole('button')).toHaveFocus();
  await user.keyboard('{Enter}');
  // Assert action
});
```

### 4. Storybook Documentation

**Story Requirements:**

- ✅ All visual variants (default, outlined, ghost, etc.)
- ✅ All interactive states (hover, focus, active, disabled)
- ✅ Accessibility demo story (keyboard navigation, ARIA)
- ✅ Real-world usage examples (forms with validation, button groups, with icons, in card actions, responsive layouts)
- ✅ Proper argTypes documentation
- ✅ Component description from design system
- ✅ Auto-generated prop table (via TypeScript)
- ✅ Story controls that are ergonomic and honest about what the component actually supports
- ✅ Example coverage that is intentionally compared against the docs site so one surface does not become much richer than the other

**Story Pattern:**

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { {ComponentName} } from './{ComponentName}';

const meta: Meta<typeof {ComponentName}> = {
  title: 'Components/{ComponentName}',
  component: {ComponentName},
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Component description from Figma/design system...',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['variant1', 'variant2', 'variant3'],
      description: 'Visual style variant of the component',
    },
    // Additional argTypes...
  },
  args: {
    children: 'Default content',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Individual variant stories
export const Default: Story = {
  args: { variant: 'default' },
};

export const Variant1: Story = {
  args: { variant: 'variant1' },
};

// Demo stories
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <{ComponentName} variant="variant1">Variant 1</{ComponentName}>
      <{ComponentName} variant="variant2">Variant 2</{ComponentName}>
      <{ComponentName} variant="variant3">Variant 3</{ComponentName}>
    </div>
  ),
};

export const InForm: Story = {
  render: () => (
    <form onSubmit={(e) => e.preventDefault()}>
      {/* Real-world usage example */}
    </form>
  ),
};

export const KeyboardNavigation: Story = {
  render: () => (
    <div>
      {/* Demo keyboard interaction patterns */}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Press Tab to focus, Enter/Space to activate.',
      },
    },
  },
};
```

### 5. Documentation & Storybook UX Pass (MANDATORY)

**Do not treat this as optional polish. Complete it before handing off to manual QA.**

Review the component's user-facing documentation surfaces and make sure they explain the component clearly rather than just listing API names.

**Storybook controls policy (MANDATORY):**

- Classify every story as one of:
  - `interactive single-component example`
  - `showcase/comparison story`
  - `behavior/demo story`
- Controls rule:
  - keep controls enabled for `interactive single-component example` stories where the controls map cleanly to the rendered output
  - disable controls for `showcase/comparison` or `behavior/demo` stories when controls would be misleading or do not control the rendered output meaningfully
- For structured or nested props, do not default to raw JSON editing when a clearer control model is available
  - examples: `tag`, `icon`, `dismissButton`, `actionLink`, `metadataItems`
  - when the story only needs a stable subset of that object shape, add story-only args such as `tagText`, `tagVariant`, `iconName`, `iconSize`, `actionHref`, or similar and map them to the real prop in `render`
  - hide the raw object control for that story when the story-only controls are the intended interaction path
  - only keep raw object editing visible when the JSON shape itself is what consumers need to learn
- Use the most specific control type available for constrained values
  - `select`, `radio`, `boolean`, `text`, or `number` instead of generic object editors whenever the value set is finite or easy to model
- Do not expose controls for prop fields that the component visually ignores or overrides
  - example: if a component slot forces a fixed icon size or color, do not expose a misleading size or tone control for that story unless the story is explicitly demonstrating that constraint
- Check for misleading cases such as:
  - `All variants` stories showing one prop panel that does not affect the displayed variants
  - `Keyboard navigation` stories showing controls that do not apply to the demo content
  - multi-example stories where the controls affect none of the rendered examples
  - nested object props that require raw JSON editing even though the story only needs a text/select/boolean subset
  - controls for values that appear editable in Storybook but do not produce any visual or behavioral change in the rendered story

**Prop documentation clarity review (MANDATORY):**

- Review Storybook prop descriptions, site docs, macro options, and toolkit/React READMEs
- Rewrite vague descriptions so they explain:
  - what changes visually
  - what changes semantically
  - when one prop overrides or replaces another prop
  - whether the prop is an advanced/integration prop rather than a typical consumer prop
- Explicitly explain common confusing prop categories where relevant:
  - `heading` vs `headingHtml`
  - `text` vs `html`
  - `description` vs `descriptionHtml`
  - `headingLevel` as semantic structure, not visual styling
  - `headingClasses` or similar styling hooks
  - `classes`, `className`, `attributes`, and `ref`
- Mark advanced or integration-focused props clearly in Storybook where appropriate

**Cross-surface consistency review (MANDATORY):**

- Make sure the following surfaces do not contradict each other:
  - Storybook docs
  - site docs pages
  - macro options JSON
  - toolkit README
  - React component story/docs descriptions
- Ensure naming is consistent across toolkit and React:
  - variant names
  - component family names
  - deprecated vs preferred usage wording

**Storybook ↔ Docs Site example parity review (MANDATORY):**

- Compare Storybook example coverage against the docs-site examples for the same component
- Do not treat either surface as optional:
  - if Storybook demonstrates an important usage pattern, state, sizing option, validation state, or behavioral variant that the docs site does not show, add a docs-site example
  - if the docs site demonstrates an important usage pattern, state, sizing option, validation state, or behavioral variant that Storybook does not show, add a Storybook story
- Aim for parity in teaching value, not identical file counts
- At minimum, both surfaces should cover the most important ways a consumer learns the component:
  - default usage
  - validation/error usage
  - sizing/layout variants where relevant
  - meaningful behavioral variants or interactive states
  - any prop or option that materially changes how the component is used
- If one surface intentionally omits an example because it would be redundant, state that explicitly in your implementation notes rather than leaving the gap unexplained
- When a component has width, icon, action, conditional content, or custom messaging props, make sure both Storybook and the docs site include examples that show those props doing real work

**Output required before moving to QA:**

- Confirm that each story has an intentional controls policy
- Confirm that structured props are not exposed as raw JSON when a clearer story-specific control model would be more usable
- Confirm that no story exposes controls for values the component visibly ignores or overrides
- Confirm that prop descriptions are written in plain language, not just implementation language
- Confirm that Storybook docs, site docs, macro options, and README describe the same API consistently
- Confirm that Storybook and docs-site examples are on the same teaching level and that any important example gap has been closed in one direction or the other

### 6. Documentation Updates

**Files to update:**

- Component `README.md` (toolkit)
- Contributing docs (if patterns changed)
- Migration guides (if breaking changes, include from what version to what version it breaks and how to migrate it)
- Design token docs (if new tokens added)

**README Structure:**

- Component description and purpose
- Quick start with live examples
- API documentation (parameters/props)
- Variants and usage
- Accessibility notes
- Examples (HTML, Nunjucks, React)

### 7. Mandatory Pre-QA Self-Review

Before moving to the validation prompt, answer these checks explicitly:

- [ ] Are any Storybook controls misleading for any story?
- [ ] Does every story have an intentional controls policy?
- [ ] Are any nested or structured props still exposed as raw JSON even though the story could offer clearer text/select/boolean controls instead?
- [ ] Do any story controls expose values that the component visually ignores or overrides?
- [ ] Are `heading`, `headingLevel`, and any HTML-overrides explained clearly where relevant?
- [ ] Are advanced props such as `classes`, `className`, `attributes`, and `ref` clearly described as advanced/integration props where appropriate?
- [ ] Do Storybook docs, site docs, macro options, and README describe the same API consistently?
- [ ] Are showcase/demo stories clearly non-interactive where appropriate?
- [ ] Do Storybook and docs-site examples cover the same important usage patterns, states, and props?
- [ ] If one surface had weaker example coverage, was it brought up to the same teaching level?
- [ ] Has every meaningful spacing/typography token from Figma been checked against the actual mobile / tablet / desktop values in code?
- [ ] Have semantic-element defaults (`p`, `ul`, `li`, `h*`, `a`) been checked so the component is not accidentally inheriting the wrong margins or typography?

If any answer is "no", fix it before moving to the QA prompt.

---

## Verification Phase

### Build & Tests

Run from repository root:

```bash
# Build all packages
pnpm build

# Test toolkit
pnpm test:toolkit
# or: pnpm --filter=@ourfuturehealth/toolkit run test

# Test React components
pnpm test:react-components
# or: pnpm --filter=@ourfuturehealth/react-components run test

# Build Storybook
pnpm --filter=@ourfuturehealth/react-components run build:storybook

# Run Storybook locally
pnpm storybook
```

### Manual Testing

1. Test both participant and research themes
2. Test keyboard navigation (Tab, Enter, Space, Arrow keys)
3. Test with screen reader (if complex component)
4. Visual comparison with Figma specs
5. Test in `example-react-consumer-app` when you need an external-style React consumer check
6. If the install contract changed, also run the tarball smoke tests
7. For components using responsive spacing or typography tokens, spot-check mobile, tablet, and desktop values in DevTools for the highest-risk subelements

### Documentation Review

1. Verify README is up-to-date
2. Check Storybook documentation completeness
3. Verify TypeScript types are exported
4. Check that all examples work
5. Check Storybook and docs-site example parity for important usage patterns

---

## Deliverables Checklist

### Toolkit Implementation

- [ ] `template.njk` updated/created
- [ ] `macro.njk` updated/created
- [ ] SCSS updated/created with all variants
- [ ] JavaScript behavior (if needed)
- [ ] Integration tests added/updated
- [ ] `README.md` updated

### React Implementation (MANDATORY)

- [ ] **React component exists** (created if it was missing)
- [ ] TypeScript component created/updated
- [ ] Props interface with proper types
- [ ] Native ref for React 19+
- [ ] **Matches toolkit functionality/capability** (same variants, same behavior, same element rendering logic where relevant)
- [ ] React API is idiomatic and easy to use
- [ ] Common visual/behavior choices use semantic React props rather than requiring toolkit class-name knowledge
- [ ] Component tests (unit + a11y)
- [ ] Exported from package index

### Storybook Documentation

- [ ] All variant stories created
- [ ] Interactive state demos
- [ ] Real-world usage examples
- [ ] Accessibility demo
- [ ] ArgTypes documented
- [ ] Component description added
- [ ] Each story has an intentional controls policy
- [ ] Showcase/behavior-demo stories do not expose misleading controls
- [ ] Prop descriptions explain visual vs semantic behavior clearly
- [ ] Storybook and docs-site examples cover the same important usage patterns and props

### Testing

- [ ] Toolkit integration tests pass
- [ ] React unit tests pass
- [ ] Accessibility tests pass (no axe violations)
- [ ] Keyboard navigation tested
- [ ] All tests pass in CI

### Documentation

- [ ] Component README complete
- [ ] Storybook auto-docs generated
- [ ] Migration notes (if breaking changes)
- [ ] Updated relevant contributing docs
- [ ] Site docs, Storybook docs, macro options, and README are consistent
- [ ] Advanced/integration props are explained clearly where relevant

### Quality Checks

- [ ] ESLint passes
- [ ] Stylelint passes
- [ ] TypeScript compiles with no errors
- [ ] Both themes render correctly
- [ ] Visual match with Figma

---

## Agent Execution Guidelines

**Critical principles to follow throughout this workflow:**

- **Toolkit + React parity is mandatory**: Never treat React components as "nice to have". Both toolkit and React versions MUST be updated or created. They must deliver the same user-facing capabilities and behavior, even if the React API is more idiomatic than the toolkit API.

- **Workflow discipline**: Always complete toolkit implementation first → test thoroughly → polish it → then create/update React component to match in capability. The React component should usually wrap toolkit classes and behavior, but it should expose the clearest React-facing API for consumers.

- **React API simplicity matters**: Prefer semantic React props like `variant`, `size`, `tone`, `status`, or `children` over raw toolkit class-name or macro-style APIs when that makes the component easier to understand and use.

- **When React component is missing**: This is a required deliverable, not optional future work. Create the React component before marking the ticket complete. Reference existing React components for patterns.

- **Complex component strategy**: For large components (Tables, Forms), you may break work into multiple tickets focused on core functionality first, then enhancements - BUT each ticket must still deliver both toolkit and React versions.

- **Design token questions**: If Figma uses colors/spacing not in the token system, ask the user before implementing custom values.

- **Accessibility questions**: When unsure about ARIA patterns, consult [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/).

- **Testing priorities**: Focus on user-facing behavior and accessibility. Don't test implementation details.

- **Documentation depth**: Keep component READMEs user-focused. Put technical details in code comments.

- **Ask before proceeding**: Present gap analysis findings and ask whether to implement just JIRA scope or include MUST FIX items. Don't assume scope.

- **Never ask**: "Should I create the React component?" - The answer is always YES.
