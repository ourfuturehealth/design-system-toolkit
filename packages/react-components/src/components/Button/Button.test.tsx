import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

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
      'ghost-reverse',
      'text',
      'text-reverse',
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
});
