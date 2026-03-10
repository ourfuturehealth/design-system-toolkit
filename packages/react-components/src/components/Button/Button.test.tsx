import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';
import { createRef } from 'react';

describe('Button', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });

    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('ofh-button');
  });

  describe('variants', () => {
    const variants = [
      'contained',
      'outlined',
      'ghost',
      'ghost-inverted',
      'text',
      'text-inverted',
    ] as const;

    variants.forEach((variant) => {
      it(`applies ${variant} variant class`, () => {
        render(<Button variant={variant}>{variant} Button</Button>);
        const button = screen.getByRole('button', {
          name: new RegExp(variant, 'i'),
        });

        expect(button).toHaveClass(`ofh-button--${variant}`);
      });
    });
  });

  it('handles click events', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click me</Button>);
    const button = screen.getByRole('button');

    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Button</Button>);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('custom-class');
  });

  it('renders as anchor tag when href is provided', () => {
    render(<Button href="https://example.com">Link Button</Button>);
    const link = screen.getByRole('link', { name: /link button/i });

    expect(link).toBeInTheDocument();
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveClass('ofh-button');
  });

  it('applies variant class to anchor element', () => {
    render(
      <Button href="#test" variant="outlined">
        Link
      </Button>,
    );
    const link = screen.getByRole('link');

    expect(link).toHaveClass('ofh-button--outlined');
  });

  it('supports disabled state for buttons', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
  });

  it('forwards ref to button element', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Button</Button>);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current?.tagName).toBe('BUTTON');
  });

  it('forwards ref to anchor element when href is provided', () => {
    const ref = createRef<HTMLAnchorElement>();
    render(
      <Button ref={ref} href="#test">
        Link
      </Button>,
    );

    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
    expect(ref.current?.tagName).toBe('A');
  });

  it('is keyboard accessible as button', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Button</Button>);
    const button = screen.getByRole('button');

    await user.tab();
    expect(button).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(handleClick).toHaveBeenCalledTimes(1);

    await user.keyboard(' ');
    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  it('passes through additional button attributes', () => {
    render(
      <Button type="submit" name="submitBtn" value="submit">
        Submit
      </Button>,
    );
    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveAttribute('name', 'submitBtn');
    expect(button).toHaveAttribute('value', 'submit');
  });

  it('passes through additional anchor attributes', () => {
    render(
      <Button href="https://example.com" target="_blank" rel="noopener">
        External Link
      </Button>,
    );
    const link = screen.getByRole('link');

    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener');
  });
});
