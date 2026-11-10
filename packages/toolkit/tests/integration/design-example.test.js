import DesignExample from '../../../site/scripts/design-example';

describe('Design example clipboard actions', () => {
  let example;
  let copyLinkButton;
  let copyLinkStatus;
  let copyCodeButton;
  let appendChild;
  let writeText;

  beforeEach(() => {
    jest.useFakeTimers();
    document.body.innerHTML = `
      <div class="design-example" id="example-button">
        <button class="design-example__copy-link" hidden>Copy link</button>
        <span class="design-example__copy-link-status" role="status"></span>
        <div class="code-snippet__preformatted">
          <code></code>
          <a class="app-link--copy" href="#">Copy code</a>
        </div>
      </div>
    `;
    example = new DesignExample(document.querySelector('.design-example'));
    copyLinkButton = document.querySelector('.design-example__copy-link');
    copyLinkStatus = document.querySelector('.design-example__copy-link-status');
    copyCodeButton = document.querySelector('.app-link--copy');
    writeText = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    // Keep the legacy fallback operational so the test can detect DOM insertion.
    document.execCommand = jest.fn().mockReturnValue(true);
    appendChild = jest.spyOn(document.body, 'appendChild');
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
    delete navigator.clipboard;
    delete document.execCommand;
    window.history.replaceState({}, '', '/');
  });

  it('copies the page URL with the example fragment as plain text', async () => {
    window.history.replaceState({}, '', '/components/button/?q=%3Cimg%20onerror%3Dalert(1)%3E#old');
    const expectedUrl = new URL(window.location.href);
    expectedUrl.hash = 'example-button';

    await example.handleCopyLinkClick();

    expect(writeText).toHaveBeenCalledWith(expectedUrl.href);
    expect(appendChild).not.toHaveBeenCalled();
    expect(copyLinkStatus.textContent).toBe('Link copied');
    expect(copyLinkButton.classList.contains('design-example__copy-link--copied')).toBe(true);
    jest.runOnlyPendingTimers();
    expect(copyLinkStatus.textContent).toBe('');
    expect(copyLinkButton.classList.contains('design-example__copy-link--copied')).toBe(false);
  });

  it.each([undefined, {}])('reports unavailable clipboard support without inserting URL data into the DOM (%p)', async (clipboard) => {
    Object.defineProperty(navigator, 'clipboard', { value: clipboard });
    window.history.replaceState({}, '', '/?q=%3Cscript%3Ealert(1)%3C/script%3E');

    await example.handleCopyLinkClick();

    expect(appendChild).not.toHaveBeenCalled();
    expect(document.execCommand).not.toHaveBeenCalled();
    expect(copyLinkStatus.textContent).toBe('Unable to copy link. Please try again.');
    expect(copyLinkButton.classList.contains('design-example__copy-link--copied')).toBe(false);
  });

  it('reports clipboard permission failures when copying a link', async () => {
    writeText.mockRejectedValue(new Error('Permission denied'));

    await example.handleCopyLinkClick();

    expect(copyLinkStatus.textContent).toBe('Unable to copy link. Please try again.');
    expect(copyLinkButton.classList.contains('design-example__copy-link--copied')).toBe(false);
    expect(appendChild).not.toHaveBeenCalled();
  });

  it('copies HTML snippets verbatim as plain text', async () => {
    const code = '</textarea><img src=x onerror=alert(1)> & "quoted"';
    document.querySelector('code').innerText = code;
    const preventDefault = jest.fn();

    await example.handleCopyClick({ currentTarget: copyCodeButton, preventDefault });

    expect(preventDefault).toHaveBeenCalled();
    expect(writeText).toHaveBeenCalledWith(code);
    expect(copyCodeButton.innerText).toBe('Copied');
    expect(appendChild).not.toHaveBeenCalled();
  });

  it.each(['unavailable', 'denied'])('reports errors when copying code with clipboard access %s', async (failure) => {
    document.querySelector('code').innerText = '<button>Example</button>';
    if (failure === 'unavailable') {
      Object.defineProperty(navigator, 'clipboard', { value: undefined });
    } else {
      writeText.mockRejectedValue(new Error('Permission denied'));
    }

    await example.handleCopyClick({ currentTarget: copyCodeButton, preventDefault: jest.fn() });

    expect(copyCodeButton.innerText).toBe('Error');
    expect(appendChild).not.toHaveBeenCalled();
  });
});
