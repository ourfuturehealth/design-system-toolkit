import { joinClasses, type OfhTagProps } from './ofhUtils';

export const OfhTag = ({ text, html, classes = '', attributes }: OfhTagProps) => {
  const tagAttributes = attributes ?? {};
  const className = joinClasses('ofh-tag', classes, tagAttributes.className);

  if (html) {
    return (
      <strong
        {...tagAttributes}
        className={className}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <strong {...tagAttributes} className={className}>
      {text}
    </strong>
  );
};
