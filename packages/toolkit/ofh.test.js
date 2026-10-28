const renderHiddenCookieBanner = () => {
  document.body.innerHTML = `
    <section data-module="ofh-cookie-banner" hidden></section>
  `;

  return document.querySelector('[data-module="ofh-cookie-banner"]');
};

const setDocumentReadyState = (readyState) => {
  Object.defineProperty(document, 'readyState', {
    configurable: true,
    value: readyState,
  });
};

describe('Toolkit initialization', () => {
  afterEach(() => {
    delete document.readyState;
    document.body.innerHTML = '';
    jest.resetModules();
  });

  it('waits for DOMContentLoaded when the document is loading', () => {
    const banner = renderHiddenCookieBanner();
    setDocumentReadyState('loading');

    require('./ofh');

    expect(banner.hidden).toBe(true);

    document.dispatchEvent(new Event('DOMContentLoaded'));

    expect(banner.hidden).toBe(false);
  });

  it('initializes immediately when DOMContentLoaded has already fired', () => {
    const banner = renderHiddenCookieBanner();
    setDocumentReadyState('complete');

    require('./ofh');

    expect(banner.hidden).toBe(false);
  });
});
