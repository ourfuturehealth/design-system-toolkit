/**
 * IE polyfill for NodeList.forEach()
 */
if (!NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach;
}

/**
 * IE polyfill for Array.includes()
 */
if (!Array.prototype.includes) {
   
  Object.defineProperty(Array.prototype, 'includes', {
    enumerable: false,
    value(obj) {
      return this.filter(el => el === obj).length > 0;
    },
  });
}

/**
 * IE polyfill for Element.closest()
 */
if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector
    || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
  Element.prototype.closest = function (s) {
    let el = this;

    do {
      if (Element.prototype.matches.call(el, s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
}
