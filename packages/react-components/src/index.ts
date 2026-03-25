// Main library entry point
// Components will be exported from here

// Import styles to be included in build
import './styles/main.scss';

// Export types
export type { ComponentProps } from 'react';

// Export components
export { Button } from './components/Button';
export type { ButtonProps } from './components/Button';

export { TextInput } from './components/TextInput';
export type { TextInputProps } from './components/TextInput';

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
