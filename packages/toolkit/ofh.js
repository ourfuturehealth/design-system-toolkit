// Components
import Card from './components/card/card';
import Checkboxes from './components/checkboxes/checkboxes';
import Details from './components/details/details';
import ErrorSummary from './components/error-summary/error-summary';
import Header from './components/header/header';
import Radios from './components/radios/radios';
import LinkSkip from './components/link-skip/link-skip';
import AutoComplete from './components/auto-complete/auto-complete';
import CharacterCount from './components/character-count/character-count';
import CookieBanner from './components/cookie-banner/cookie-banner';

import './polyfills';

const initialize = () => {
  Card();
  Checkboxes();
  Details();
  ErrorSummary();
  Header();
  Radios();
  LinkSkip();
  AutoComplete();
  CharacterCount();
  CookieBanner();
};

// Initialize components
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize, { once: true });
} else {
  initialize();
}
