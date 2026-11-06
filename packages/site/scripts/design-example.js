/* eslint-disable */

import * as iframeResize from 'iframe-resizer/js/iframeResizer'

class DesignExample {

    static selector() {
        return '.design-example';
    }

    constructor(node, onPreviewResized = () => {}) {
        this.node = node;
        this.tabClass = 'app-tabs__item';
        this.currentTabClass = this.tabClass + '--current';
        this.hiddenClass = 'js-hidden';
        this.tabs = Array.prototype.slice.call(this.node.querySelectorAll(`.${this.tabClass}`));
        this.examples = Array.prototype.slice.call(this.node.querySelectorAll('.code-snippet__preformatted'));
        this.closeButtons = Array.prototype.slice.call(this.node.querySelectorAll('.app-link--close'));
        this.copyButtons = Array.prototype.slice.call(this.node.querySelectorAll('.app-link--copy'));
        this.copyLinkButton = this.node.querySelector('.design-example__copy-link');
        this.copyLinkStatus = this.node.querySelector('.design-example__copy-link-status');
        this.heading = null;
        this.iframe = this.node.querySelector('iframe');

        this.bindEvents();

        if (this.iframe) {
            // Default sizing avoids page-position resets during smooth navigation.
            iFrameResize({ onResized: onPreviewResized }, this.iframe);
        }
    }

    bindEvents() {
        this.tabs.forEach(tab => tab.addEventListener('click', e => this.handleTabClick(e)));

        if (this.closeButtons) {
            this.closeButtons.forEach(closeButton => closeButton.addEventListener('click', e => this.handleCloseClick(e)));
        }

        this.copyButtons.forEach(copyButton => copyButton.addEventListener('click', e => this.handleCopyClick(e)));

        if (this.copyLinkButton) {
            this.attachCopyLinkToHeading();
            this.copyLinkButton.hidden = false;
            this.copyLinkButton.addEventListener('click', () => this.handleCopyLinkClick());
        }
    }

    attachCopyLinkToHeading() {
        let sibling = this.node.previousElementSibling;

        // Descriptions may sit between a variant title and its example.
        // Stop at another example so repeated previews do not share a title.
        while (sibling && !sibling.classList.contains('design-example')) {
            if (/^H[2-6]$/.test(sibling.tagName)) {
                this.heading = sibling;
                const title = sibling.textContent.trim();
                sibling.classList.add('design-example__heading');
                sibling.append(this.copyLinkButton.parentElement);
                this.copyLinkButton.querySelector('.ofh-u-visually-hidden').textContent = `Copy link to ${title}`;
                return;
            }
            sibling = sibling.previousElementSibling;
        }
    }

    async handleCopyLinkClick() {
        const url = new URL(window.location.href);
        url.hash = this.node.id;
        const status = this.copyLinkStatus;
        clearTimeout(this.copyLinkStatusTimeout);
        this.copyLinkButton.classList.remove('design-example__copy-link--copied');
        status.textContent = '';

        try {
            await this.copyToClipboard(url.href, this.copyLinkButton);
            this.copyLinkButton.classList.add('design-example__copy-link--copied');
            status.textContent = 'Link copied';
        } catch {
            status.textContent = 'Unable to copy link. Please try again.';
        }

        this.copyLinkStatusTimeout = setTimeout(() => {
            this.copyLinkButton.classList.remove('design-example__copy-link--copied');
            status.textContent = '';
        }, 2000);
    }

    handleTabClick(e) {
        const targetEl = e.target.parentElement;
        const index = targetEl.dataset.index;

        e.preventDefault();

        this.tabs.forEach(tab => {
            if (tab.classList.contains(this.currentTabClass)) {
                tab.classList.remove(this.currentTabClass);
            }
        });

        targetEl.classList.add(this.currentTabClass);

        this.exampleToggler(index);
    }

    handleCloseClick() {
        this.examples.forEach(example => {
            this.hideEl(example);
        });

        this.tabs.forEach(tab => {
            if (tab.classList.contains(this.currentTabClass)) {
                tab.classList.remove(this.currentTabClass);
            }
        });
    }

    // Display a brief notification text then revert to the elements original HTML content
    inlineNotify(el, text) {
        const originalInnerHtml = el.innerHTML;
        el.innerText = text;
        setTimeout(() => el.innerHTML = originalInnerHtml, 2500);
    }

    // Keep clipboard behavior shared while callers provide their own feedback.
    async copyToClipboard(str, trigger) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(str);
            return;
        }

        const textarea = document.createElement('textarea');
        textarea.value = str;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);

        try {
            textarea.select();
            if (!document.execCommand('copy')) {
                throw new Error('Copy failed');
            }
        } finally {
            textarea.remove();
            trigger.focus({ preventScroll: true });
        }
    }

    async handleCopyClick(e) {
        e.preventDefault();
        const trigger = e.currentTarget;
        const str = this.node.querySelector('.code-snippet__preformatted:not(.js-hidden) code').innerText;
        try {
            await this.copyToClipboard(str, trigger);
            this.inlineNotify(trigger, 'Copied');
        } catch {
            this.inlineNotify(trigger, 'Error');
        }
    }

    showEl(el) {
        if (el.classList.contains(this.hiddenClass)) {
            el.classList.remove(this.hiddenClass);
        }
    }

    hideEl(el) {
        if (!el.classList.contains(this.hiddenClass)) {
            el.classList.add(this.hiddenClass);
        }
    }

    exampleToggler(index) {
        this.examples.forEach(example => {
            example.dataset.index === index ?
                example.classList.remove(this.hiddenClass) :
                example.classList.add(this.hiddenClass);
        });
    }

    // Yoink attr: https://www.456bereastreet.com/archive/201112/how_to_adjust_an_iframe_elements_height_to_fit_its_content/
    setIframeHeight(iframe) {
        if (iframe) {
            const iframeWin = iframe.contentWindow || iframe.contentDocument.parentWindow;
            if (iframeWin.document.body) {
                iframe.height = iframeWin.document.documentElement.scrollHeight || iframeWin.document.body.scrollHeight;
            }
        }
    }
}

export default DesignExample;
