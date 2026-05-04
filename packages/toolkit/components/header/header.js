const isOpen = (toggle) => toggle?.getAttribute('aria-expanded') === 'true';

const closeDisclosure = (group, toggleSelector, panelSelector) => {
  const toggle = group?.querySelector(toggleSelector);
  const panel = group?.querySelector(panelSelector);

  if (!toggle || !panel) {
    return;
  }

  toggle.setAttribute('aria-expanded', 'false');
  group.classList.remove('is-open');
  panel.hidden = true;
};

const openDisclosure = (group, toggleSelector, panelSelector) => {
  const toggle = group?.querySelector(toggleSelector);
  const panel = group?.querySelector(panelSelector);

  if (!toggle || !panel) {
    return;
  }

  toggle.setAttribute('aria-expanded', 'true');
  group.classList.add('is-open');
  panel.hidden = false;
};

const initHeader = (headerElement) => {
  const menuToggle = headerElement.querySelector('[data-ofh-header-menu-toggle]');
  const mobilePanel = headerElement.querySelector('[data-ofh-header-mobile-panel]');
  const desktopGroups = Array.from(
    headerElement.querySelectorAll('[data-ofh-header-group]'),
  );
  const mobileGroups = Array.from(
    headerElement.querySelectorAll('[data-ofh-header-mobile-group]'),
  );

  const closeAllDesktopGroups = (exceptGroup) => {
    desktopGroups.forEach((group) => {
      if (group !== exceptGroup) {
        closeDisclosure(
          group,
          '[data-ofh-header-group-toggle]',
          '[data-ofh-header-group-panel]',
        );
      }
    });
  };

  const closeAllMobileGroups = (exceptGroup) => {
    mobileGroups.forEach((group) => {
      if (group !== exceptGroup) {
        closeDisclosure(
          group,
          '[data-ofh-header-mobile-group-toggle]',
          '[data-ofh-header-mobile-group-panel]',
        );
      }
    });
  };

  const closeMobilePanel = () => {
    if (!menuToggle || !mobilePanel) {
      return;
    }

    menuToggle.setAttribute('aria-expanded', 'false');
    mobilePanel.hidden = true;
    closeAllMobileGroups();
  };

  if (menuToggle && mobilePanel) {
    menuToggle.addEventListener('click', (event) => {
      event.preventDefault();

      if (isOpen(menuToggle)) {
        closeMobilePanel();
        return;
      }

      menuToggle.setAttribute('aria-expanded', 'true');
      mobilePanel.hidden = false;
    });
  }

  desktopGroups.forEach((group) => {
    const toggle = group.querySelector('[data-ofh-header-group-toggle]');

    if (!toggle) {
      return;
    }

    toggle.addEventListener('click', (event) => {
      event.preventDefault();
      const groupIsOpen = isOpen(toggle);

      closeAllDesktopGroups(group);

      if (groupIsOpen) {
        closeDisclosure(
          group,
          '[data-ofh-header-group-toggle]',
          '[data-ofh-header-group-panel]',
        );
      } else {
        openDisclosure(
          group,
          '[data-ofh-header-group-toggle]',
          '[data-ofh-header-group-panel]',
        );
      }
    });

    group.addEventListener('focusout', (event) => {
      if (!group.contains(event.relatedTarget)) {
        closeDisclosure(
          group,
          '[data-ofh-header-group-toggle]',
          '[data-ofh-header-group-panel]',
        );
      }
    });
  });

  mobileGroups.forEach((group) => {
    const toggle = group.querySelector('[data-ofh-header-mobile-group-toggle]');

    if (!toggle) {
      return;
    }

    toggle.addEventListener('click', (event) => {
      event.preventDefault();
      const groupIsOpen = isOpen(toggle);

      closeAllMobileGroups(group);

      if (groupIsOpen) {
        closeDisclosure(
          group,
          '[data-ofh-header-mobile-group-toggle]',
          '[data-ofh-header-mobile-group-panel]',
        );
      } else {
        openDisclosure(
          group,
          '[data-ofh-header-mobile-group-toggle]',
          '[data-ofh-header-mobile-group-panel]',
        );
      }
    });
  });

  headerElement
    .querySelectorAll(
      '.ofh-header__mobile-link, .ofh-header__mobile-subnav-link, .ofh-header__mobile-footer-link .ofh-link-icon__link',
    )
    .forEach((link) => {
      link.addEventListener('click', () => {
        closeMobilePanel();
      });
    });

  headerElement.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') {
      return;
    }

    closeAllDesktopGroups();
    closeMobilePanel();
  });

  document.addEventListener('click', (event) => {
    if (!headerElement.contains(event.target)) {
      closeAllDesktopGroups();
    }
  });
};

export default () => {
  if (typeof document === 'undefined') {
    return;
  }

  document.querySelectorAll('[data-ofh-header]').forEach(initHeader);
};
