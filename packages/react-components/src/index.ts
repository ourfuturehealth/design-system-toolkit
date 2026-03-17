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

export { Tag } from './components/Tag';
export type { TagProps } from './components/Tag';
