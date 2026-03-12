import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { ErrorSummary } from './ErrorSummary';

describe('ErrorSummary', () => {
  const originalScrollIntoView = window.HTMLElement.prototype.scrollIntoView;

  beforeAll(() => {
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  beforeEach(() => {
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    window.HTMLElement.prototype.scrollIntoView = originalScrollIntoView;
  });

  it('renders the toolkit classes and list items', () => {
    render(
      <ErrorSummary
        titleText="There is a problem"
        errorList={[
          {
            text: 'Enter your first name',
            href: '#first-name',
          },
        ]}
      />,
    );

    const summary = screen.getByRole('alert');

    expect(summary).toHaveClass('ofh-error-summary');
    expect(summary).not.toHaveAttribute('tabindex');
    expect(screen.getByRole('heading', { name: 'There is a problem' })).toHaveClass(
      'ofh-error-summary__title',
    );
    expect(
      screen.getByRole('link', { name: 'Enter your first name' }),
    ).toBeInTheDocument();
  });

  it('prefers html props over text props', () => {
    render(
      <ErrorSummary
        titleText="Fallback title"
        titleHtml="<span>HTML title</span>"
        descriptionText="Fallback description"
        descriptionHtml="<span>HTML description</span>"
        errorList={[
          {
            text: 'Fallback item',
            html: '<span><strong>HTML</strong> item</span>',
            href: '#email',
          },
        ]}
      />,
    );

    expect(screen.getByText('HTML title')).toBeInTheDocument();
    expect(screen.queryByText('Fallback title')).not.toBeInTheDocument();
    expect(screen.getByText('HTML description')).toBeInTheDocument();
    expect(screen.queryByText('Fallback description')).not.toBeInTheDocument();
    expect(screen.getByText('HTML')).toBeInTheDocument();
    expect(screen.queryByText('Fallback item')).not.toBeInTheDocument();
  });

  it('applies toolkit-style classes and attributes', () => {
    render(
      <ErrorSummary
        titleText="There is a problem"
        classes="custom-summary"
        className="react-summary"
        idPrefix="custom-error-summary"
        attributes={{
          id: 'summary-root',
          'data-testid': 'summary-root',
        }}
        errorList={[
          {
            text: 'Enter your email address',
            href: '#email',
            attributes: {
              'data-testid': 'summary-link',
            },
          },
        ]}
      />,
    );

    const summary = screen.getByTestId('summary-root');
    const link = screen.getByTestId('summary-link');

    expect(summary).toHaveClass('ofh-error-summary', 'custom-summary', 'react-summary');
    expect(summary).toHaveAttribute('id', 'summary-root');
    expect(summary).toHaveAttribute('aria-labelledby', 'custom-error-summary-title');
    expect(screen.getByRole('heading')).toHaveAttribute(
      'id',
      'custom-error-summary-title',
    );
    expect(link).toHaveAttribute('href', '#email');
  });

  it('generates unique title ids when no idPrefix is provided', () => {
    render(
      <>
        <ErrorSummary
          titleText="First summary"
          errorList={[{ text: 'First error', href: '#first-field' }]}
        />
        <ErrorSummary
          titleText="Second summary"
          errorList={[{ text: 'Second error', href: '#second-field' }]}
        />
      </>,
    );

    const summaries = screen.getAllByRole('alert');
    const titleIds = summaries.map((summary) => summary.getAttribute('aria-labelledby'));

    expect(titleIds[0]).toBeTruthy();
    expect(titleIds[0]).not.toEqual(titleIds[1]);
  });

  it('does not focus the summary on mount', () => {
    render(
      <>
        <ErrorSummary
          titleText="First summary"
          errorList={[{ text: 'First error', href: '#first-field' }]}
        />
        <ErrorSummary
          titleText="Second summary"
          errorList={[{ text: 'Second error', href: '#second-field' }]}
        />
      </>,
    );

    expect(document.activeElement).not.toBe(screen.getAllByRole('alert')[0]);
  });

  it('focuses the linked input when selecting any error link', async () => {
    const user = userEvent.setup();

    render(
      <>
        <ErrorSummary
          titleText="There is a problem"
          errorList={[
            {
              text: 'Enter your first name',
              href: '#first-name',
            },
            {
              text: 'Enter your last name',
              href: '#last-name',
            },
          ]}
        />
        <label htmlFor="first-name">First name</label>
        <input id="first-name" type="text" />
        <label htmlFor="last-name">Last name</label>
        <input id="last-name" type="text" />
      </>,
    );

    await user.click(screen.getByRole('link', { name: 'Enter your last name' }));

    expect(document.activeElement).toBe(screen.getByLabelText('Last name'));
    expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalledTimes(1);
  });

  it('focuses the linked input when clicking nested html inside the link', async () => {
    const user = userEvent.setup();

    render(
      <>
        <ErrorSummary
          titleText="There is a problem"
          errorList={[
            {
              html: '<span><strong>Email</strong> address</span>',
              href: '#email',
            },
          ]}
        />
        <label htmlFor="email">Email address</label>
        <input id="email" type="email" />
      </>,
    );

    await user.click(screen.getByText('Email'));

    expect(document.activeElement).toBe(screen.getByLabelText('Email address'));
  });

  it('ignores placeholder hash links without throwing', async () => {
    const user = userEvent.setup();

    render(
      <ErrorSummary
        titleText="There is a problem"
        errorList={[
          {
            text: 'Placeholder link',
            href: '#',
          },
        ]}
      />,
    );

    await expect(
      user.click(screen.getByRole('link', { name: 'Placeholder link' })),
    ).resolves.not.toThrow();
  });

  it('scrolls the related fieldset into view for radio inputs', async () => {
    const user = userEvent.setup();

    render(
      <>
        <ErrorSummary
          titleText="There is a problem"
          errorList={[
            {
              text: 'Select how to contact you',
              href: '#contact',
            },
          ]}
        />
        <fieldset>
          <legend>How should we contact you?</legend>
          <input id="contact" type="radio" name="contact" />
        </fieldset>
      </>,
    );

    const scrollIntoView = vi.fn();
    screen.getByRole('group').scrollIntoView = scrollIntoView;

    await user.click(screen.getByRole('link', { name: 'Select how to contact you' }));

    expect(scrollIntoView).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(screen.getByRole('radio'));
  });

  it('scrolls the related fieldset into view for checkbox inputs', async () => {
    const user = userEvent.setup();

    render(
      <>
        <ErrorSummary
          titleText="There is a problem"
          errorList={[
            {
              text: 'Select how to contact you',
              href: '#contact-email',
            },
          ]}
        />
        <fieldset>
          <legend>How should we contact you?</legend>
          <input id="contact-email" type="checkbox" name="contact" />
        </fieldset>
      </>,
    );

    const scrollIntoView = vi.fn();
    screen.getByRole('group').scrollIntoView = scrollIntoView;

    await user.click(screen.getByRole('link', { name: 'Select how to contact you' }));

    expect(scrollIntoView).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(screen.getByRole('checkbox'));
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <ErrorSummary
        titleText="There is a problem"
        errorList={[
          {
            text: 'Enter your first name',
            href: '#first-name',
          },
          {
            text: 'Enter your last name',
            href: '#last-name',
          },
        ]}
      />,
    );

    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });
});
