export default () => {
  if (typeof document === 'undefined') {
    return;
  }

  const interactiveSelector =
    'a, button, input, select, textarea, summary, [role="button"], [role="link"]';

  document.querySelectorAll('.ofh-card--clickable').forEach((card) => {
    const primaryLink = card.querySelector(
      '[data-ofh-card-primary-link], .ofh-card__primary-link, .ofh-card__link',
    );

    if (primaryLink !== null) {
      card.addEventListener('click', (event) => {
        if (!(event.target instanceof Element)) {
          return;
        }

        const interactiveAncestor = event.target.closest(interactiveSelector);

        if (interactiveAncestor && interactiveAncestor !== primaryLink) {
          return;
        }

        if (interactiveAncestor === primaryLink) {
          return;
        }

        primaryLink.click();
      });
    }
  });
};
