export default () => {
  if (typeof document === 'undefined') {
    return;
  }

  const banners = document.querySelectorAll('[data-module="ofh-cookie-banner"]');

  banners.forEach((banner) => banner.removeAttribute('hidden'));
};
