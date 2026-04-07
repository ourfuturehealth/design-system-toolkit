# Footer

## Guidance

Use the footer to show service support links, concise organisation details, and optional social links at the bottom of a page.

Find out more about the footer component and when to use it in the [design system docs website](https://designsystem.ourfuturehealth.org.uk/design-system/components/footer).

## Quick start example

[Preview the footer component](https://ourfuturehealth.github.io/design-system-toolkit/components/footer/index.html)

### HTML markup

```html
<footer role="contentinfo">
  <div class="ofh-footer" id="ofh-footer">
    <div class="ofh-footer__main">
      <div class="ofh-width-container">
        <div class="ofh-footer__main-inner">
          <div class="ofh-footer__meta">
            <h2 class="ofh-u-visually-hidden">Support links</h2>
            <ul class="ofh-footer__links">
              <li class="ofh-footer__links-item">
                <a class="ofh-footer__link" href="#">Help and Support</a>
              </li>
              <li class="ofh-footer__links-item">
                <a class="ofh-footer__link" href="#">
                  Careers
                  <svg class="ofh-icon ofh-icon--16 ofh-icon--Launch ofh-footer__link-icon" aria-hidden="true" focusable="false">
                    ...
                  </svg>
                </a>
              </li>
            </ul>
            <p class="ofh-footer__small-print">&copy; Our Future Health 2026</p>
          </div>
          <p class="ofh-footer__legal">Organisation legal text.</p>
        </div>
      </div>
    </div>
    <div class="ofh-footer__social">
      <div class="ofh-width-container">
        <div class="ofh-footer__social-inner">
          <p class="ofh-footer__social-title">Follow us</p>
          <ul class="ofh-footer__social-list">
            <li class="ofh-footer__social-item">
              <a class="ofh-footer__social-link" href="#">
                ...
                <span class="ofh-u-visually-hidden">LinkedIn</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</footer>
```

### Nunjucks macro

```njk
{% from 'components/footer/macro.njk' import footer %}

{{ footer({
  "links": [
    {
      "url": "#help",
      "label": "Help and Support"
    },
    {
      "url": "https://example.com/careers",
      "label": "Careers",
      "external": true,
      "openInNewWindow": true
    }
  ],
  "smallPrint": "&copy; Our Future Health 2026",
  "legalText": "Organisation legal text.",
  "socialLinks": [
    {
      "platform": "linkedin",
      "href": "https://www.linkedin.com/company/our-future-health/",
      "openInNewWindow": true
    }
  ]
}) }}
```

### Nunjucks arguments

| Name | Type | Required | Description |
| ---- | ---- | ---- | ---- |
| `links` | array | No | Array of footer link items. |
| `links[].url` | string | No | Href for the footer link item. The legacy `URL` key is still supported for compatibility. |
| `links[].label` | string | Yes | Visible label for the footer link item. |
| `links[].external` | boolean | No | Adds a right-side launch icon for external links. |
| `links[].openInNewWindow` | boolean | No | Opens the link in a new window and adds `rel=\"noopener noreferrer\"`. |
| `links[].attributes` | object | No | Extra HTML attributes for the footer link item. |
| `smallPrint` | string | No | Small-print line shown under the support links. |
| `copyright` | string | No | Backward-compatible alias for `smallPrint`. |
| `legalText` | string | No | Additional legal copy shown below the small-print line. |
| `legalHtml` | string | No | Trusted HTML alternative for the legal copy. |
| `socialLabel` | string | No | Label shown before the social links on tablet and desktop. Defaults to `Follow us`. |
| `socialLinks` | array | No | Array of social link items. |
| `socialLinks[].platform` | string | Yes | One of `linkedin`, `x`, `facebook`, `youtube`, `instagram`, or `tiktok`. |
| `socialLinks[].href` | string | Yes | Href for the social link. |
| `socialLinks[].label` | string | No | Accessible label override for the social link. |
| `socialLinks[].openInNewWindow` | boolean | No | Opens the social link in a new window. |
| `socialLinks[].attributes` | object | No | Extra HTML attributes for the social link. |
| `classes` | string | No | Optional additional classes to add to the footer container. |
| `attributes` | object | No | Extra HTML attributes for the footer container. |
