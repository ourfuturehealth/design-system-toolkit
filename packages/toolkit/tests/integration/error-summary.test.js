import ErrorSummary from '../../components/error-summary/error-summary';

describe('Error summary module', () => {
  const originalScrollIntoView = window.HTMLElement.prototype.scrollIntoView;

  beforeEach(() => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  afterAll(() => {
    window.HTMLElement.prototype.scrollIntoView = originalScrollIntoView;
  });

  describe('if no error summary elements exists', () => {
    it('should not throw an error', () => {
      ErrorSummary();
    });
  });

  describe('if an error summary exists', () => {
    beforeEach(() => {
      document.body.innerHTML =
        '<div role="alert" tabindex="-1" class="ofh-error-summary"></div>';
      ErrorSummary();
    });

    it('should focus on the error summary', () => {
      const errorSummary = document.querySelector('.ofh-error-summary');

      expect(document.activeElement).toBe(errorSummary);
    });

    it('should focus only on the first instance of the error summary', () => {
      const div = document.createElement('div');
      div.innerHTML =
        '<div role="alert" tabindex="-1" class="ofh-error-summary"></div>';

      document.body.appendChild(div.firstChild);

      expect(document.body.childElementCount).toBe(2);

      ErrorSummary();

      expect(document.activeElement).toBe(document.body.firstElementChild);
      expect(document.activeElement).not.toBe(document.body.children[1]);
    });

    it('should not focus on the error summary when focusOnPageLoad is false', () => {
      document.body.innerHTML =
        '<div role="alert" tabindex="-1" class="ofh-error-summary"></div>';

      ErrorSummary({ focusOnPageLoad: false });

      expect(document.activeElement).toBe(document.body);
    });
  });

  describe('error links', () => {
    it('should focus the linked input when selecting any error link', () => {
      document.body.innerHTML = `
        <div role="alert" tabindex="-1" class="ofh-error-summary">
          <ul class="ofh-list ofh-error-summary__list">
            <li><a href="#first-name">Enter your first name</a></li>
            <li><a href="#last-name">Enter your last name</a></li>
          </ul>
        </div>
        <label for="first-name">First name</label>
        <input id="first-name" type="text" />
        <label for="last-name">Last name</label>
        <input id="last-name" type="text" />
      `;

      ErrorSummary({ focusOnPageLoad: false });

      document.querySelector('a[href="#last-name"]').click();

      expect(document.activeElement).toBe(document.querySelector('#last-name'));
      expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalledTimes(1);
    });

    it('should focus the linked input when clicking nested content inside the link', () => {
      document.body.innerHTML = `
        <div role="alert" tabindex="-1" class="ofh-error-summary">
          <ul class="ofh-list ofh-error-summary__list">
            <li>
              <a href="#email">
                <span>Email address</span>
              </a>
            </li>
          </ul>
        </div>
        <label for="email">Email address</label>
        <input id="email" type="email" />
      `;

      ErrorSummary({ focusOnPageLoad: false });

      document.querySelector('a[href="#email"] span').click();

      expect(document.activeElement).toBe(document.querySelector('#email'));
    });

    it('should scroll a related legend into view for radio inputs', () => {
      document.body.innerHTML = `
        <div role="alert" tabindex="-1" class="ofh-error-summary">
          <ul class="ofh-list ofh-error-summary__list">
            <li><a href="#contact">Select how to contact you</a></li>
          </ul>
        </div>
        <fieldset>
          <legend id="contact-legend">How should we contact you?</legend>
          <input id="contact" type="radio" name="contact" />
        </fieldset>
      `;

      const legend = document.querySelector('legend');
      legend.scrollIntoView = jest.fn();

      ErrorSummary({ focusOnPageLoad: false });

      document.querySelector('a[href="#contact"]').click();

      expect(legend.scrollIntoView).toHaveBeenCalledTimes(1);
      expect(document.activeElement).toBe(document.querySelector('#contact'));
    });

    it('should enhance links in every error summary instance', () => {
      document.body.innerHTML = `
        <div role="alert" tabindex="-1" class="ofh-error-summary">
          <ul class="ofh-list ofh-error-summary__list">
            <li><a href="#first-name">Enter your first name</a></li>
          </ul>
        </div>
        <div role="alert" tabindex="-1" class="ofh-error-summary">
          <ul class="ofh-list ofh-error-summary__list">
            <li><a href="#last-name">Enter your last name</a></li>
          </ul>
        </div>
        <label for="first-name">First name</label>
        <input id="first-name" type="text" />
        <label for="last-name">Last name</label>
        <input id="last-name" type="text" />
      `;

      ErrorSummary({ focusOnPageLoad: false });

      document.querySelectorAll('.ofh-error-summary a')[1].click();

      expect(document.activeElement).toBe(document.querySelector('#last-name'));
    });
  });
});
