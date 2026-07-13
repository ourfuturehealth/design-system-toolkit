import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { Hero } from './Hero';

describe('Hero', () => {
  it('renders the default hero structure with both actions and media', () => {
    render(
      <Hero
        heading="Design and build digital products at Our Future Health"
        description="Information and guidelines to help everyone design and build consistent products."
        secondaryAction={{ children: 'Get started', href: '/get-started' }}
        primaryAction={{ children: 'View components', href: '/components' }}
        image={{
          src: 'https://example.com/hero-image.jpg',
          alt: 'Example hero image',
          srcSet:
            'https://example.com/hero-image-640.jpg 640w, https://example.com/hero-image-960.jpg 960w',
          sizes: '(min-width: 1020px) 50vw, 100vw',
        }}
      />,
    );

    expect(document.querySelector('.ofh-hero')).toHaveClass(
      'ofh-hero--brand',
      'ofh-hero--free',
      'ofh-hero--with-image',
    );
    expect(document.querySelectorAll('.ofh-hero__decoration')).toHaveLength(2);
    expect(document.querySelectorAll('.ofh-hero .ofh-tile-pattern')).toHaveLength(2);
    expect(document.querySelector('.ofh-tile-pattern')).toHaveClass(
      'ofh-tile-pattern--color-brand',
    );
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Design and build digital products at Our Future Health',
    );
    expect(screen.getByRole('link', { name: 'Get started' })).toHaveAttribute(
      'href',
      '/get-started',
    );
    expect(screen.getByRole('link', { name: 'View components' })).toHaveClass(
      'ofh-button',
      'ofh-button--contained',
    );
    expect(screen.getByRole('img', { name: 'Example hero image' })).toHaveAttribute(
      'srcset',
      'https://example.com/hero-image-640.jpg 640w, https://example.com/hero-image-960.jpg 960w',
    );
  });

  it('supports dark boxed heroes and text-only layouts', () => {
    render(
      <Hero
        theme="dark"
        variant="boxed"
        heading="Design principles"
        headingLevel={2}
      />,
    );

    expect(document.querySelector('.ofh-hero')).toHaveClass(
      'ofh-hero--dark',
      'ofh-hero--boxed',
    );
    expect(document.querySelectorAll('.ofh-hero__decoration')).toHaveLength(3);
    expect(document.querySelector('.ofh-tile-pattern')).toHaveClass(
      'ofh-tile-pattern--color-white',
    );
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Design principles',
    );
    expect(document.querySelector('.ofh-hero__media-column')).toBeNull();
  });

  it('treats decorative images as decorative and allows root override', () => {
    const ref = createRef<HTMLElement>();

    render(
      <Hero
        as="div"
        ref={ref}
        heading="Decorative image hero"
        image={{
          src: 'https://example.com/decorative.svg',
          decorative: true,
        }}
      />,
    );

    const image = screen.getByRole('presentation', { hidden: true });

    expect(ref.current?.tagName).toBe('DIV');
    expect(image).toHaveAttribute('alt', '');
    expect(image).toHaveAttribute('aria-hidden', 'true');
  });

  it('disables decoration and adds safe rel values for new-window secondary actions', () => {
    render(
      <Hero
        heading="No decoration hero"
        showDecoration={false}
        secondaryAction={{
          children: 'Read guidance',
          href: 'https://example.com',
          openInNewWindow: true,
        }}
      />,
    );

    expect(document.querySelector('.ofh-hero')).toHaveClass('ofh-hero--no-decoration');
    expect(document.querySelector('.ofh-hero__decoration')).toBeNull();
    expect(document.querySelector('.ofh-tile-pattern')).toBeNull();
    expect(screen.getByRole('link', { name: 'Read guidance' })).toHaveAttribute(
      'rel',
      'noopener noreferrer',
    );
    expect(screen.getByRole('link', { name: 'Read guidance' })).toHaveAttribute(
      'target',
      '_blank',
    );
  });

  it('adds safe rel values when secondary actions pass target blank directly', () => {
    render(
      <Hero
        heading="Direct target hero"
        secondaryAction={{
          children: 'Open guidance',
          href: 'https://example.com',
          target: '_blank',
          rel: 'external',
        }}
      />,
    );

    expect(screen.getByRole('link', { name: 'Open guidance' })).toHaveAttribute(
      'rel',
      'external noopener noreferrer',
    );
    expect(screen.getByRole('link', { name: 'Open guidance' })).toHaveAttribute(
      'target',
      '_blank',
    );
  });

  it('adds safe rel values for new-window primary actions', () => {
    render(
      <Hero
        heading="Primary action hero"
        primaryAction={{
          children: 'Open components',
          href: 'https://example.com/components',
          target: '_blank',
          rel: 'external',
        }}
      />,
    );

    expect(screen.getByRole('link', { name: 'Open components' })).toHaveAttribute(
      'rel',
      'external noopener noreferrer',
    );
  });

  it('has no accessibility violations for a text-only hero', async () => {
    const { container } = render(
      <Hero
        heading="Accessible hero"
        description="Short supporting copy for an accessible hero."
        secondaryAction={{ children: 'Read more', href: '/read-more' }}
        primaryAction={{ children: 'Continue', type: 'button' }}
      />,
    );

    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
