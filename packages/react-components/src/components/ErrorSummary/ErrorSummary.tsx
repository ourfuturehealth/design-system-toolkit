import React from 'react';

type AttributeValue = string | number | boolean | null | undefined;
type AttributeMap = Record<string, AttributeValue>;

export interface ErrorSummaryItem {
  href?: string;
  text?: string;
  html?: string;
  attributes?: AttributeMap;
}

export interface ErrorSummaryProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'children' | 'dangerouslySetInnerHTML' | 'ref' | 'title'
  > {
  /**
   * Plain text heading content.
   * If `titleHtml` is provided it takes precedence.
   */
  titleText?: string;
  /**
   * HTML heading content.
   * If provided it takes precedence over `titleText`.
   */
  titleHtml?: string;
  /**
   * Plain text description content.
   * If `descriptionHtml` is provided it takes precedence.
   */
  descriptionText?: string;
  /**
   * HTML description content.
   * If provided it takes precedence over `descriptionText`.
   */
  descriptionHtml?: string;
  /**
   * Error items displayed in the summary list.
   */
  errorList: ErrorSummaryItem[];
  /**
   * Additional toolkit-style classes for the container.
   */
  classes?: string;
  /**
   * Additional toolkit-style attributes for the container.
   */
  attributes?: AttributeMap;
  /**
   * Prefix used to generate the title id referenced by aria-labelledby.
   */
  idPrefix?: string;
  /**
   * Ref forwarding for the underlying element.
   */
  ref?: React.Ref<HTMLDivElement>;
}

function assignRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (typeof ref === 'function') {
    ref(value);
    return;
  }

  if (ref) {
    ref.current = value;
  }
}

function getAssociatedLegendOrLabel(input: HTMLElement) {
  const fieldset = input.closest('fieldset');

  if (fieldset) {
    const legends = fieldset.getElementsByTagName('legend');

    if (legends.length) {
      const candidateLegend = legends[0];
      const inputType =
        input instanceof HTMLInputElement
          ? input.type
          : input.getAttribute('type');

      if (inputType === 'checkbox' || inputType === 'radio') {
        return candidateLegend;
      }

      const legendTop = candidateLegend.getBoundingClientRect().top;
      const inputRect = input.getBoundingClientRect();

      if (inputRect.height && window.innerHeight) {
        const inputBottom = inputRect.top + inputRect.height;

        if (inputBottom - legendTop < window.innerHeight / 2) {
          return candidateLegend;
        }
      }
    }
  }

  const inputId = input.getAttribute('id');

  return (
    (inputId ? document.querySelector(`label[for='${inputId}']`) : null) ||
    input.closest('label')
  );
}

function focusTarget(target: HTMLAnchorElement | null) {
  if (!target || !target.hash) {
    return false;
  }

  const input = document.querySelector(target.hash);

  if (!(input instanceof HTMLElement)) {
    return false;
  }

  const legendOrLabel = getAssociatedLegendOrLabel(input);

  if (!(legendOrLabel instanceof HTMLElement)) {
    return false;
  }

  legendOrLabel.scrollIntoView();
  input.focus({ preventScroll: true });

  return true;
}

export const ErrorSummary = ({
  titleText,
  titleHtml,
  descriptionText,
  descriptionHtml,
  errorList,
  classes = '',
  className = '',
  attributes,
  idPrefix,
  onClick,
  ref,
  id,
  ...props
}: ErrorSummaryProps) => {
  const localRef = React.useRef<HTMLDivElement | null>(null);
  const generatedId = React.useId().replace(/:/g, '');
  const { id: attributeIdValue, ...restAttributes } = attributes ?? {};
  const attributeId =
    attributeIdValue === null || attributeIdValue === undefined
      ? undefined
      : String(attributeIdValue);
  const rootId = id ?? attributeId;
  const titleIdBase = idPrefix ?? rootId ?? `error-summary-${generatedId}`;
  const titleId = `${titleIdBase}-title`;
  const rootClasses = ['ofh-error-summary', classes, className]
    .filter(Boolean)
    .join(' ');

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    onClick?.(event);

    if (event.defaultPrevented || !(event.target instanceof Element)) {
      return;
    }

    const link = event.target.closest('a');

    if (!(link instanceof HTMLAnchorElement)) {
      return;
    }

    if (focusTarget(link)) {
      event.preventDefault();
    }
  };

  return (
    <div
      {...(restAttributes as React.HTMLAttributes<HTMLDivElement>)}
      {...props}
      id={rootId}
      ref={(node) => {
        localRef.current = node;
        assignRef(ref, node);
      }}
      className={rootClasses}
      aria-labelledby={titleId}
      role="alert"
      onClick={handleClick}
    >
      <h2
        className="ofh-error-summary__title"
        id={titleId}
        {...(titleHtml ? { dangerouslySetInnerHTML: { __html: titleHtml } } : {})}
      >
        {titleHtml ? undefined : titleText}
      </h2>
      <div className="ofh-error-summary__body">
        {(descriptionHtml || descriptionText) && (
          <p
            {...(descriptionHtml
              ? { dangerouslySetInnerHTML: { __html: descriptionHtml } }
              : {})}
          >
            {descriptionHtml ? undefined : descriptionText}
          </p>
        )}
        <ul className="ofh-list ofh-error-summary__list">
          {errorList.map((item, index) => {
            const itemKey = `${item.href ?? item.text ?? item.html ?? 'error'}-${index}`;

            if (item.href) {
              return (
                <li key={itemKey}>
                  <a
                    href={item.href}
                    {...(item.attributes as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
                    {...(item.html
                      ? { dangerouslySetInnerHTML: { __html: item.html } }
                      : {})}
                  >
                    {item.html ? undefined : item.text}
                  </a>
                </li>
              );
            }

            if (item.html) {
              return (
                <li
                  key={itemKey}
                  dangerouslySetInnerHTML={{ __html: item.html }}
                />
              );
            }

            return <li key={itemKey}>{item.text}</li>;
          })}
        </ul>
      </div>
    </div>
  );
};

ErrorSummary.displayName = 'ErrorSummary';
