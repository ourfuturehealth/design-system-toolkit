# Component Update Template Prompt

Use this template to align a component between Figma design, toolkit implementation, and React library.

---

## Quick Start Copy-Paste

**How to use this template:**

1. Copy everything from `## Component Update: {COMPONENT_NAME}` below through `## Deliverables Checklist`
2. Paste into your GitHub Copilot chat
3. Replace all `{PLACEHOLDERS}` with actual values:
   - `{COMPONENT_NAME}` → e.g., "Button"
   - `{component-name}` → e.g., "button"
   - `{ComponentName}` → e.g., "Button"
   - `{JIRA_TICKET_ID}` → ticket number
   - Paste JIRA content into the designated section
   - `{Figma URL with node-id}` → Figma component link
4. Delete or skip the "Usage Instructions", "Example", and "Tips" sections at the bottom
5. Send to Copilot to begin the component update workflow

**💡 Tip:** Keep this file as your master reference template. Don't create component-specific files.

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
2. Implement/update toolkit component (HTML/Nunjucks/SCSS/JS)
3. Implement/update React component wrapper
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
- If exists: Review implementation against toolkit parity
- If missing: Note as new implementation needed

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

### 5. Gap Analysis

Compare Figma ↔ Toolkit ↔ React:

- Missing variants or states
- Design token mismatches (colors, spacing, typography)
- Accessibility requirements not met
- API inconsistencies
- Documentation gaps

**Ask for feedback:** Present complete analysis (steps 3-5) and proposed changes before implementing.

---

## Implementation Phase

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
- ✅ Smart element rendering (button/a/input where appropriate)

### 2. React Component Implementation

**Files to create/modify:**

- `packages/react-components/src/components/{ComponentName}/{ComponentName}.tsx`
- `packages/react-components/src/components/{ComponentName}/{ComponentName}.test.tsx`
- `packages/react-components/src/components/{ComponentName}/{ComponentName}.stories.tsx`
- `packages/react-components/src/components/{ComponentName}/{ComponentName}.module.scss` (if needed)
- `packages/react-components/src/components/{ComponentName}/index.ts`
- `packages/react-components/src/index.ts` (add exports)

**Requirements:**

- ✅ TypeScript with strict mode
- ✅ Extend appropriate HTML element props interface
- ✅ Match toolkit variants and API exactly
- ✅ Reuse toolkit CSS classes (`.ofh-{component}`, `.ofh-{component}--{variant}`)
- ✅ Forward refs to underlying DOM elements
- ✅ Export component and type interfaces
- ✅ Follow toolkit's element selection logic (e.g., Button with href renders as `<a>`)

**Component Pattern:**

```tsx
export interface {ComponentName}Props extends React.{ElementType}HTMLAttributes<HTML{ElementType}Element> {
  variant?: 'variant1' | 'variant2' | 'variant3';
  // Additional props from Figma
}

export const {ComponentName} = React.forwardRef<HTML{ElementType}Element, {ComponentName}Props>(
  ({ variant = 'default', className = '', ...props }, ref) => {
    const classes = [
      'ofh-{component}',
      `ofh-{component}--${variant}`,
      className,
    ].filter(Boolean).join(' ');

    return <{element} ref={ref} className={classes} {...props} />;
  }
);

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
- Migration guides (if breaking changes)
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

### React Implementation

- [ ] TypeScript component created/updated
- [ ] Props interface with proper types
- [ ] Ref forwarding implemented
- [ ] Component tests (unit + a11y)
- [ ] Exported from package index
- [ ] Matches toolkit API exactly

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

## Usage Instructions

**To use this template:**

1. Copy this template and replace all `{PLACEHOLDERS}`:
   - `{COMPONENT_NAME}` - e.g., "Button", "TextInput", "Card"
   - `{component-name}` - kebab-case version
   - `{ComponentName}` - PascalCase version
   - `{JIRA_TICKET_ID}` - ticket number
   - Paste JIRA content into the designated section
   - `{Figma URL with node-id}` - Figma component link

2. Start with **Analysis Phase** - use Figma MCP to fetch design specs

3. Review current implementation files

4. Present gap analysis and ask for feedback before implementing

5. Work through **Implementation Phase** systematically

6. Run **Verification Phase** checks

7. Complete all items in **Deliverables Checklist**

8. Request code review with links to Figma and JIRA context

**Questions to Ask During Process:**

- If design differs significantly from current implementation
- If API changes would break existing usage
- If simplification opportunities need validation
- If new patterns are needed that don't exist yet
- If documentation needs major restructuring

---

## Example: Filling Out for Button Component

```markdown
## Component Update: Button

### Context

- **JIRA Ticket ID:** DS-123
- **JIRA Requirements/Notes:**
```

Update Button component to align with new Figma design system.

Acceptance Criteria:

- Support 6 variants: contained, outlined, ghost, ghost-reverse, text, text-reverse
- Add proper focus indicators per WCAG 2.1 AA
- Support disabled state consistently across variants
- Add loading state support
- Ensure keyboard accessibility (Tab, Enter, Space)

```
- **Figma Component:** https://figma.com/file/abc123?node-id=456:789
- **Related PRs:** #166 (monorepo restructure), #170 (token alignment)
```

---

## Tips

- **Breaking down large components:** If the component is complex (e.g., Table, Form), consider breaking the work into multiple tickets/PRs focusing on core functionality first, then enhancements.

- **Design token questions:** If Figma uses colors/spacing not in your token system, ask the designer before implementing custom values.

- **Accessibility questions:** When in doubt about ARIA patterns, consult [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/).

- **Testing priorities:** Focus on user-facing behavior and accessibility. Don't test implementation details.

- **Documentation depth:** Keep component READMEs user-focused. Technical details go in code comments.
