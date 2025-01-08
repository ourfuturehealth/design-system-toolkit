/* eslint-disable no-new */
// Design system toolkit components
import MenuToggle from '../../packages/components/header/menuToggle';
import SkipLink from '../../packages/components/skip-link/skip-link';
import Details from '../../packages/components/details/details';
import Checkboxes from '../../packages/components/checkboxes/checkboxes';
import Radios from '../../packages/components/radios/radios';
import Card from '../../packages/components/card/card';
import AutoComplete from '../../packages/components/auto-complete/auto-complete';
import CharacterCount from '../../packages/components/character-count/character-count';

// Toolkit polyfills
import '../../packages/polyfills';

// Documentation site example components
import DesignExample from './design-example';

// Initialise toolkit components
MenuToggle();
Details();
SkipLink();
Checkboxes();
Radios();
Card();
AutoComplete();
CharacterCount();

// Initialise documentation site components

// Design examples
document.querySelectorAll(DesignExample.selector()).forEach((el) => {
  new DesignExample(el);
});
