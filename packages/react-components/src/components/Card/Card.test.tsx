import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Card } from './Card';

describe('Card', () => {
  it('renders a basic card with heading and description', () => {
    render(<Card heading="Card heading" description="Card description" />);

    expect(screen.getByText('Card heading')).toBeInTheDocument();
    expect(screen.getByText('Card description')).toBeInTheDocument();
    expect(document.querySelector('.ofh-card')).toHaveClass('ofh-card');
  });

  it('adds the dismissible content modifier when a dismiss button is present', () => {
    render(
      <Card
        heading="Dismissible card"
        description="Dismissible description"
        dismissButton={{ label: 'Dismiss card' }}
      />,
    );

    expect(document.querySelector('.ofh-card__content')).toHaveClass(
      'ofh-card__content--dismissible',
    );
  });

  it('does not add the dismissible content modifier when an image is present', () => {
    render(
      <Card
        heading="Dismissible image card"
        description="Dismissible image description"
        imgURL="https://example.com/image.jpg"
        imgALT=""
        dismissButton={{ label: 'Dismiss card' }}
      />,
    );

    expect(document.querySelector('.ofh-card__content')).not.toHaveClass(
      'ofh-card__content--dismissible',
    );
  });

  it('proxies clicks from the card surface to the primary link', async () => {
    const user = userEvent.setup();

    render(
      <Card
        variant="clickable"
        href="#card-surface"
        heading="Clickable heading"
        description="Clickable description"
      />,
    );

    const card = document.querySelector('.ofh-card');
    const link = screen.getByRole('link', { name: 'Clickable heading' });
    const handleClick = vi.fn((event: Event) => event.preventDefault());

    link.addEventListener('click', handleClick);
    await user.click(card as HTMLElement);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not proxy clicks from nested interactive elements', async () => {
    const user = userEvent.setup();

    render(
      <Card
        variant="clickable"
        href="#primary-link"
        heading="Clickable heading"
        description="Clickable description"
        dismissButton={{
          label: 'Dismiss card',
        }}
      />,
    );

    const primaryLink = screen.getByRole('link', { name: 'Clickable heading' });
    const dismissButton = screen.getByRole('button', { name: 'Dismiss card' });
    const primaryClick = vi.fn((event: Event) => event.preventDefault());
    const dismissClick = vi.fn();

    primaryLink.addEventListener('click', primaryClick);
    dismissButton.addEventListener('click', dismissClick);

    await user.click(dismissButton);

    expect(dismissClick).toHaveBeenCalledTimes(1);
    expect(primaryClick).not.toHaveBeenCalled();
  });

  it('uses the action link as the primary target when no href is provided', async () => {
    const user = userEvent.setup();

    render(
      <Card
        variant="clickable"
        number="12"
        actionLink={{
          text: 'Open tasks',
          href: '#open-tasks',
        }}
      />,
    );

    const card = document.querySelector('.ofh-card');
    const link = screen.getByRole('link', { name: 'Open tasks' });
    const handleClick = vi.fn((event: Event) => event.preventDefault());

    link.addEventListener('click', handleClick);
    await user.click(card as HTMLElement);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders icon, tag, metadata and helper text', () => {
    render(
      <Card
        heading="Profile complete"
        description="All required information is now saved."
        icon={{ name: 'Done', size: 32 }}
        tag={{ children: 'New', variant: 'blue' }}
        metadataItems={[
          { icon: 'AccessTime', text: '5 minute read' },
          { icon: 'CalendarTodayOutlined', text: 'Updated today' },
        ]}
        helperText="Recommended for new participants."
      />,
    );

    expect(screen.getByText('New')).toHaveClass('ofh-tag', 'ofh-tag--blue');
    expect(screen.getByText('5 minute read')).toBeInTheDocument();
    expect(screen.getByText('Updated today')).toBeInTheDocument();
    expect(
      screen.getByText('Recommended for new participants.'),
    ).toBeInTheDocument();
    expect(document.querySelector('.ofh-card__icon')).toBeInTheDocument();
  });

  it('forwards ref to the card root element', () => {
    const ref = createRef<HTMLDivElement>();

    render(<Card ref={ref} heading="Card heading" />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveClass('ofh-card');
  });

  it('has no accessibility violations for a clickable card', async () => {
    const { container } = render(
      <Card
        variant="clickable"
        href="#card-a11y"
        heading="Clickable heading"
        description="Clickable description"
      />,
    );

    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
