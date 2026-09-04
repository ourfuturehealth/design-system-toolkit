/** @jest-environment node */

const path = require('path');
const sass = require('sass');

const compileBreakpointCss = () =>
  sass.compileString(
    `
      @import 'core/settings/breakpoints';
      @import 'core/vendor/sass-mq';

      .from-desktop {
        @include mq($from: desktop) {
          color: red;
        }
      }

      .until-desktop {
        @include mq($until: desktop) {
          color: red;
        }
      }

      .from-large-desktop {
        @include mq($from: large-desktop) {
          color: red;
        }
      }

      .until-large-desktop {
        @include mq($until: large-desktop) {
          color: red;
        }
      }
    `,
    {
      loadPaths: [path.resolve(__dirname, '../../')],
      quietDeps: true,
      silenceDeprecations: ['if-function', 'import'],
    },
  ).css;

describe('breakpoint Sass output', () => {
  it('compiles named desktop boundaries from the shared mq() mixin', () => {
    const css = compileBreakpointCss();

    expect(css).toContain('@media (min-width: 61.875em)');
    expect(css).toContain('@media (max-width: 61.865em)');
    expect(css).toContain('@media (min-width: 90em)');
    expect(css).toContain('@media (max-width: 89.99em)');
  });
});
