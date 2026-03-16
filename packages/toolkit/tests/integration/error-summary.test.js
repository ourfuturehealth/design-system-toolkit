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
    it('should not focus on the error summary', () => {
      document.body.innerHTML =
        '<div role="alert" class="ofh-error-summary"></div>';

      ErrorSummary();

      expect(document.activeElement).toBe(document.body);
    });

    it('should not focus any instance when multiple summaries exist', () => {
      document.body.innerHTML =
        '<div role="alert" class="ofh-error-summary"></div>';

      const div = document.createElement('div');
      div.innerHTML =
        '<div role="alert" class="ofh-error-summary"></div>';

      document.body.appendChild(div.firstChild);

      expect(document.body.childElementCount).toBe(2);

      ErrorSummary();

      expect(document.activeElement).toBe(document.body);
    });
  });

  describe('error links', () => {
    it('should focus the linked input when selecting any error link', () => {
      document.body.innerHTML = `
        <div role="alert" class="ofh-error-summary">
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

      ErrorSummary();

      document.querySelector('a[href="#last-name"]').click();

      expect(document.activeElement).toBe(document.querySelector('#last-name'));
      expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalledTimes(1);
    });

    it('should focus the linked input when clicking nested content inside the link', () => {
      document.body.innerHTML = `
        <div role="alert" class="ofh-error-summary">
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

      ErrorSummary();

      document.querySelector('a[href="#email"] span').click();

      expect(document.activeElement).toBe(document.querySelector('#email'));
    });

    it('should ignore placeholder hash links without throwing', () => {
      document.body.innerHTML = `
        <div role="alert" class="ofh-error-summary">
          <ul class="ofh-list ofh-error-summary__list">
            <li><a href="#">Placeholder link</a></li>
          </ul>
        </div>
      `;

      ErrorSummary();

      expect(() => document.querySelector('a[href="#"]').click()).not.toThrow();
      expect(document.activeElement).toBe(document.body);
    });

    it('should scroll the related fieldset into view for radio inputs', () => {
      document.body.innerHTML = `
        <div role="alert" class="ofh-error-summary">
          <ul class="ofh-list ofh-error-summary__list">
            <li><a href="#contact">Select how to contact you</a></li>
          </ul>
        </div>
        <fieldset>
          <legend id="contact-legend">How should we contact you?</legend>
          <input id="contact" type="radio" name="contact" />
        </fieldset>
      `;

      const fieldset = document.querySelector('fieldset');
      fieldset.scrollIntoView = jest.fn();

      ErrorSummary();

      document.querySelector('a[href="#contact"]').click();

      expect(fieldset.scrollIntoView).toHaveBeenCalledTimes(1);
      expect(document.activeElement).toBe(document.querySelector('#contact'));
    });

    it('should scroll the related fieldset into view for checkbox inputs', () => {
      document.body.innerHTML = `
        <div role="alert" class="ofh-error-summary">
          <ul class="ofh-list ofh-error-summary__list">
            <li><a href="#contact-email">Select how to contact you</a></li>
          </ul>
        </div>
        <fieldset>
          <legend>How should we contact you?</legend>
          <input id="contact-email" type="checkbox" name="contact" />
        </fieldset>
      `;

      const fieldset = document.querySelector('fieldset');
      fieldset.scrollIntoView = jest.fn();

      ErrorSummary();

      document.querySelector('a[href="#contact-email"]').click();

      expect(fieldset.scrollIntoView).toHaveBeenCalledTimes(1);
      expect(document.activeElement).toBe(document.querySelector('#contact-email'));
    });

    it('should enhance links in every error summary instance', () => {
      document.body.innerHTML = `
        <div role="alert" class="ofh-error-summary">
          <ul class="ofh-list ofh-error-summary__list">
            <li><a href="#first-name">Enter your first name</a></li>
          </ul>
        </div>
        <div role="alert" class="ofh-error-summary">
          <ul class="ofh-list ofh-error-summary__list">
            <li><a href="#last-name">Enter your last name</a></li>
          </ul>
        </div>
        <label for="first-name">First name</label>
        <input id="first-name" type="text" />
        <label for="last-name">Last name</label>
        <input id="last-name" type="text" />
      `;

      ErrorSummary();

      document.querySelectorAll('.ofh-error-summary a')[1].click();

      expect(document.activeElement).toBe(document.querySelector('#last-name'));
    });
  });
});
