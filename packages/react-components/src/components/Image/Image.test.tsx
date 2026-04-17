import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { Image } from './Image';

describe('Image', () => {
  it('renders the image with caption and responsive source attributes', () => {
    render(
      <Image
        src="https://assets.nhs.uk/prod/images/S_1017_allergic-conjunctivitis_M15.2e16d0ba.fill-320x213.jpg"
        alt="Picture of allergic conjunctivitis"
        caption="Itchy, red, watering eyes."
        sizes="(min-width: 1020px) 320px, (min-width: 768px) 50vw, 100vw"
        srcSet="https://assets.nhs.uk/prod/images/S_1017_allergic-conjunctivitis_M15.2e16d0ba.fill-640x427.jpg 640w, https://assets.nhs.uk/prod/images/S_1017_allergic-conjunctivitis_M15.2e16d0ba.fill-767x511.jpg 767w"
      />,
    );

    const image = screen.getByRole('img', {
      name: 'Picture of allergic conjunctivitis',
    });

    expect(image).toHaveAttribute(
      'sizes',
      '(min-width: 1020px) 320px, (min-width: 768px) 50vw, 100vw',
    );
    expect(image).toHaveAttribute(
      'srcset',
      'https://assets.nhs.uk/prod/images/S_1017_allergic-conjunctivitis_M15.2e16d0ba.fill-640x427.jpg 640w, https://assets.nhs.uk/prod/images/S_1017_allergic-conjunctivitis_M15.2e16d0ba.fill-767x511.jpg 767w',
    );
    expect(screen.getByText('Itchy, red, watering eyes.')).toBeInTheDocument();
  });

  it('omits the caption when none is provided', () => {
    render(
      <Image
        src="https://assets.nhs.uk/prod/images/S_1017_allergic-conjunctivitis_M15.2e16d0ba.fill-320x213.jpg"
        alt="Picture of allergic conjunctivitis"
      />,
    );

    expect(document.querySelector('.ofh-image__caption')).toBeNull();
  });

  it('forwards ref and supports custom class names', () => {
    const ref = createRef<HTMLElement>();

    render(
      <Image
        ref={ref}
        className="custom-image"
        src="https://assets.nhs.uk/prod/images/S_1017_allergic-conjunctivitis_M15.2e16d0ba.fill-320x213.jpg"
        alt="Picture of allergic conjunctivitis"
      />,
    );

    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.tagName).toBe('FIGURE');
    expect(ref.current).toHaveClass('ofh-image', 'custom-image');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <Image
        src="https://assets.nhs.uk/prod/images/S_1017_allergic-conjunctivitis_M15.2e16d0ba.fill-320x213.jpg"
        alt="Picture of allergic conjunctivitis"
        caption="Itchy, red, watering eyes."
      />,
    );

    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
