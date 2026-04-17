// Main library entry point
// Components will be exported from here

// Import styles to be included in build
import './styles/main.scss';

// Export types
export type { ComponentProps } from 'react';

// Export components
export { Button } from './components/Button';
export type { ButtonProps } from './components/Button';

export { Icon } from './components/Icon';
export type { IconProps, IconSize } from './components/Icon';

export { TextInput } from './components/TextInput';
export type {
  TextInputFixedWidth,
  TextInputProps,
  TextInputWidth,
} from './components/TextInput';

export { Fieldset } from './components/Fieldset';
export type { FieldsetProps } from './components/Fieldset';

export { Textarea } from './components/Textarea';
export type { TextareaProps } from './components/Textarea';

export { Select } from './components/Select';
export type { SelectItem, SelectProps } from './components/Select';

export { DateInput } from './components/DateInput';
export type { DateInputItem, DateInputProps } from './components/DateInput';

export { Autocomplete } from './components/Autocomplete';
export type { AutocompleteProps } from './components/Autocomplete';

export { CharacterCount } from './components/CharacterCount';
export type { CharacterCountProps } from './components/CharacterCount';

export { Checkboxes } from './components/Checkboxes';
export type { CheckboxItem, CheckboxesProps } from './components/Checkboxes';

export { Radios } from './components/Radios';
export type { RadioItem, RadiosProps } from './components/Radios';

export { ErrorSummary } from './components/ErrorSummary';
export type { ErrorSummaryItem, ErrorSummaryProps } from './components/ErrorSummary';

export { Card } from './components/Card';
export type {
  CardActionLink,
  CardDismissButton,
  CardIcon,
  CardMetadataItem,
  CardProps,
  CardTag,
} from './components/Card';

export { CardCallout } from './components/CardCallout';
export type { CardCalloutProps } from './components/CardCallout';

export { CardDoDont } from './components/CardDoDont';
export type { CardDoDontItem, CardDoDontProps } from './components/CardDoDont';

export { Tag } from './components/Tag';
export type { TagProps, TagVariant } from './components/Tag';

export { Breadcrumb } from './components/Breadcrumb';
export type { BreadcrumbItem, BreadcrumbProps } from './components/Breadcrumb';
