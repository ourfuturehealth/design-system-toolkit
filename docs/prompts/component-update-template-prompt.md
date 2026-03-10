# Component Update Template Prompt

This template provides a complete workflow for updating/creating design system components. It aligns Figma design specs with toolkit implementation (HTML/Nunjucks/SCSS) and React library components.

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
- **Related PRs:** {any dependencies or related work}

---

## Objectives

1. Analyze current toolkit implementation vs Figma design
2. Implement/update toolkit component (HTML/Nunjucks/SCSS/JS) and polish it
3. **Ensure React component exists** and matches toolkit exactly (create if missing)
4. Create/update comprehensive Storybook documentation
5. Add automated tests (functional + accessibility)
6. Update all relevant documentation

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

### 2. Current Implementation Review

**Toolkit (`packages/toolkit/components/{component-name}/`):**

- Review `template.njk` - markup structure
- Review `macro.njk` - parameter API
- Review `_{component-name}.scss` - styling and variants
- Review `{component-name}.js` (if exists) - behavior
- Review `README.md` - documentation completeness
- Review `tests/integration/{component-name}.test.js` (if exists)

**React (`packages/react-components/src/components/{ComponentName}/`):**

- Check if component exists
- **If exists:** Review implementation against toolkit parity - note all discrepancies
- **If missing:** This is a REQUIRED deliverable - you MUST create the React component
- React component API and functionality must match toolkit exactly
- Both versions should work the same or as close as possible

### 3. Gap Analysis

Compare Figma ↔ Toolkit ↔ React:

- Missing variants or states
- Design token mismatches (colors, spacing, typography)
- Accessibility requirements not met
- API inconsistencies
- Documentation gaps

### 4. Design Token & Pattern Alignment (MANDATORY)

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

**Responsive Pattern Audit:**

- [ ] Manual media queries for spacing → Check if `@include ofh-responsive-padding/margin()` can be used
- [ ] Manual media queries for typography → Check if responsive typography mixin handles this
- [ ] Inconsistent breakpoint usage → Check against `$ofh-breakpoints`

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

**Code Quality Opportunities:**

- [ ] Duplicated code that could be abstracted into mixins
- [ ] Overly specific selectors that could be simplified
- [ ] Unused CSS rules or dead code
- [ ] Inconsistent naming patterns
- [ ] Missing or outdated comments

**Output Required:**

1. Create a **comprehensive list** of all findings (not just JIRA ticket items)
2. Categorize as: **MUST FIX** (breaks design system) vs. **SHOULD IMPROVE** (quality/consistency) vs. **NICE TO HAVE** (future enhancement)
3. **Present this analysis to the user BEFORE implementing** and ask: "Should I implement the JIRA ticket only, or include the MUST FIX items as well?"

---

## Implementation Phase

**IMPLEMENTATION ORDER (MANDATORY):**

1. **Toolkit First:** Update toolkit component (HTML/Nunjucks/SCSS/JS) with all changes
2. **Polish Toolkit:** Test, refine, ensure it works perfectly and matches Figma
3. **React Second:** Create/update React component to match polished toolkit
4. **Verify Parity:** Both versions have same API, variants, behavior, and functionality

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
- ✅ TypeScript with strict mode
- ✅ Extend appropriate HTML element props interface
- ✅ **Match toolkit variants and API exactly** - 1:1 parity required
- ✅ **Match toolkit functionality** - same behavior, same element selection logic
- ✅ Reuse toolkit CSS classes (`.ofh-{component}`, `.ofh-{component}--{variant}`)
- ✅ Native ref for React 19+
- ✅ Export component and type interfaces
- ✅ Follow toolkit's element selection logic (e.g., Button with href renders as `<a>`)
- ✅ All toolkit variants must be supported in React (no subset)

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
  // Additional props from Figma
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

### 5. Documentation Updates

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
5. Test in `example-react-consumer-app`

### Documentation Review

1. Verify README is up-to-date
2. Check Storybook documentation completeness
3. Verify TypeScript types are exported
4. Check that all examples work

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
- [ ] **Matches toolkit API exactly** (same variants, same props, same behavior)
- [ ] **Matches toolkit functionality** (same element rendering logic, same validation)
- [ ] Component tests (unit + a11y)
- [ ] Exported from package index

### Storybook Documentation

- [ ] All variant stories created
- [ ] Interactive state demos
- [ ] Real-world usage examples
- [ ] Accessibility demo
- [ ] ArgTypes documented
- [ ] Component description added

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

### Quality Checks

- [ ] ESLint passes
- [ ] Stylelint passes
- [ ] TypeScript compiles with no errors
- [ ] Both themes render correctly
- [ ] Visual match with Figma

---

## Agent Execution Guidelines

**Critical principles to follow throughout this workflow:**

- **Toolkit + React parity is mandatory**: Never treat React components as "nice to have". Both toolkit and React versions MUST be updated or created. They must work identically with the same API.

- **Workflow discipline**: Always complete toolkit implementation first → test thoroughly → polish it → then create/update React component to match. The React component is a faithful wrapper of the toolkit component.

- **When React component is missing**: This is a required deliverable, not optional future work. Create the React component before marking the ticket complete. Reference existing React components for patterns.

- **Complex component strategy**: For large components (Tables, Forms), you may break work into multiple tickets focused on core functionality first, then enhancements - BUT each ticket must still deliver both toolkit and React versions.

- **Design token questions**: If Figma uses colors/spacing not in the token system, ask the user before implementing custom values.

- **Accessibility questions**: When unsure about ARIA patterns, consult [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/).

- **Testing priorities**: Focus on user-facing behavior and accessibility. Don't test implementation details.

- **Documentation depth**: Keep component READMEs user-focused. Put technical details in code comments.

- **Ask before proceeding**: Present gap analysis findings and ask whether to implement just JIRA scope or include MUST FIX items. Don't assume scope.

- **Never ask**: "Should I create the React component?" - The answer is always YES.
