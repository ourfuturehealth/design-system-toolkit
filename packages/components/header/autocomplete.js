import accessibleAutocomplete from 'accessible-autocomplete';

function positionsAndWidths() {
  // Get width and position for desktop sizes to position the dropdown.
  // For smaller viewports, doesn't need to be positioned so styling is overridden by CSS
  const wrap = document.getElementById('wrap-search');

  if (wrap) {
    const wrapRect = wrap.getBoundingClientRect();
    const listBox = document.getElementById('search-field__listbox');
    listBox.style.width = wrapRect.width + 'px';
    listBox.style.top = wrapRect.bottom + 'px';
  }
}

function getFunnelbackQueryUrl(query) {
  const FUNNELBACK_QUERY_PATH = 'https://nhs.funnelback.co.uk/s/suggest.json';
  const FUNNELBACK_MAX_RESULTS = 10;
  return `${FUNNELBACK_QUERY_PATH}?collection=nhs-meta&partial_query=${query}&sort=0&fmt=json++&profile=&show=${FUNNELBACK_MAX_RESULTS}`;
}

function getFunnelbackResults(query, populateResults) {
  const url = getFunnelbackQueryUrl(query);
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.onload = function () {
    if (xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      const results = data.map(item => {
        return item.disp;
      });
      populateResults(results);
    } else {
      // TODO: nice error messaging here
      // console.warn(xhr);
    }
  };
  xhr.send();
}

function addTitle(result) {

  if (!result) {
    return '';
  }

  const listBox = document.getElementById('search-field__listbox');
  const suggestionsTitle = document.getElementById('suggestions-title');

  if (!document.getElementById('suggestions-title')) {
    const newLI = document.createElement("li"); // create search suggestions <li> and insert into list
    const textLI = document.createTextNode("Search suggestions");
    newLI.setAttribute("id", "suggestions-title");
    newLI.setAttribute("class", "suggestions-title");
    newLI.appendChild(textLI);
    listBox.insertBefore(newLI, listBox.childNodes[0]);
  }

}

function autocomplete(config) {
  const defaultId = 'search-field';
  const id = (config && config.id) ? config.id : defaultId;
  const fallbackInputElement = document.getElementById(id);

  function suggestionTemplate(result) {
    const truncateLength = 36;
    const dots = result.length > truncateLength ? '...' : '';
    const resultTruncated = result.substring(0, truncateLength) + dots;
    const svgIcon = '<svg class="nhsuk-icon nhsuk-icon__search" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M19.71 18.29l-4.11-4.1a7 7 0 1 0-1.41 1.41l4.1 4.11a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42zM5 10a5 5 0 1 1 5 5 5 5 0 0 1-5-5z"></path></svg>';
    const resultsHref = '<a href="https://www.nhs.uk/search?collection=nhs-meta&query=' + result + '">';
    const typedText = document.getElementById(id).value;
    const regex = new RegExp(typedText, 'gi');
    const typedTextStronged = resultTruncated.replace(regex, function ($1) {
      return '<strong>' + $1 + '</strong>';
    });

    const listBox = document.getElementById('search-field__listbox');
    const suggestionsTitle = document.getElementById('suggestions-title');

    return (
      addTitle(result),
      result = svgIcon + resultsHref + typedTextStronged + '</a>'
    )
  }

  const defaultConfig = {
    element: document.querySelector('#autocomplete-container'),
    id: id,
    minLength: 2,
    placeholder: fallbackInputElement.placeholder,
    // TO DO:
    // cssNamespace: ??
    // displayMenu: 'overlay', this need enable but currently breaks.
    confirmOnBlur: false,
    onConfirm: (SelectedContent) => {
      window.open('https://www.nhs.uk/search?collection=nhs-meta&query=' + SelectedContent, '_self');
    },
    source: getFunnelbackResults,
    templates: {
      suggestion: suggestionTemplate,
    },
  };

  const accessibleAutocompleteConfig = {
    ...defaultConfig,
    ...config,
  };

  document.getElementById(id).remove();
  accessibleAutocomplete(accessibleAutocompleteConfig);

}

window.addEventListener("load", function(event) {

  positionsAndWidths();

  // To deal with window resizing, need to reset positioning of search results dropdown
  // Use setTimeout on resize so as not to kill CPU
  // https://developer.mozilla.org/en-US/docs/Web/Events/resize
  window.addEventListener("resize", resizeThrottler, false);

  let resizeTimeout;
  function resizeThrottler() {
    // ignore resize events as long as an actualResizeHandler execution is in the queue
    if ( !resizeTimeout ) {
      resizeTimeout = setTimeout(function() {
        resizeTimeout = null;
        actualResizeHandler();
       // The actualResizeHandler will execute at a rate of 15fps
       }, 66);
    }
  }

  function actualResizeHandler() {
    positionsAndWidths();
  }

});

export default autocomplete;
