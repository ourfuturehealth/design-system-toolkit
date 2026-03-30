import { describe, expect, it } from 'vitest';
import { namespaceStoryArgs } from './namespaceStoryArgs';

describe('namespaceStoryArgs', () => {
  it('returns args unchanged when no arg keys are configured', () => {
    const args = { name: 'Done', size: 24 };

    expect(namespaceStoryArgs(args, 'components-icon--default', [])).toEqual(args);
  });

  it('namespaces only the configured arg keys', () => {
    expect(
      namespaceStoryArgs(
        {
          id: 'date-of-birth',
          namePrefix: 'date-of-birth',
          name: 'contact-method',
          legend: 'What is your date of birth?',
        },
        'components-input-date-input--default-docs-instance-1',
        ['id', 'name', 'namePrefix'],
      ),
    ).toEqual({
      id: 'date-of-birth--components-input-date-input--default-docs-instance-1',
      namePrefix:
        'date-of-birth--components-input-date-input--default-docs-instance-1',
      name: 'contact-method--components-input-date-input--default-docs-instance-1',
      legend: 'What is your date of birth?',
    });
  });
});
