/* eslint-disable no-new */
// NHS.UK frontend components
import MenuToggle from '../../packages/components/header/menuToggle';
import SearchToggle from '../../packages/components/header/searchToggle';
import SkipLink from '../../packages/components/skip-link/skip-link';
import Details from '../../packages/components/details/details';
import Checkboxes from '../../packages/components/checkboxes/checkboxes';
import Radios from '../../packages/components/radios/radios';
import Card from '../../packages/components/card/card';

// import AutoComplete from './autocomplete/autoCompleteConfig';

// NHS.UK frontend polyfills
import '../../packages/polyfills';

// NHS digital service manual components
import DesignExample from './design-example';

// TODO: Remove this?
// import {
//   inputValue,
//   onConfirm,
//   source,
//   suggestion,
// } from './search';

// Initialise NHS.UK frontend components

// TODO: Remove this?
// AutoComplete({
//   containerId: 'autocomplete-container',
//   formId: 'search',
//   inputId: 'search-field',
//   onConfirm,
//   source,
//   templates: {
//     inputValue,
//     suggestion,
//   },
// });

MenuToggle();
SearchToggle();
Details();
SkipLink();
Checkboxes();
Radios();
Card();

// Initialise NHS digital service manual components

// Design examples
document.querySelectorAll(DesignExample.selector()).forEach((el) => {
  new DesignExample(el);
});
