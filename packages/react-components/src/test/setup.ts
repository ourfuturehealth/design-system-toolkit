import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock .module.scss files
vi.mock('*.module.scss', () => ({
  default: new Proxy(
    {},
    {
      get: () => 'mocked-css-class',
    },
  ),
}));
