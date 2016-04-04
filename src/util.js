/**
 * Utility functions
 */


/**
 * Simple function to merge the given objects
 *
 * @param {Object[]} object Multiple object parameters
 * @returns {Object}
 */
export function merge() {
  var result = {};
  for (var i = arguments.length - 1; i >= 0; i--) {
    var obj = arguments[i];
    for (var k in obj) {
      if (obj.hasOwnProperty(k)) {
        result[k] = obj[k];
      }
    }
  }

  return result;
}

/**
 * Append a line of text at the bottom, ensuring there aren't unnecessary newlines
 *
 * @param {String} appended Current content
 * @param {String} previous Value which should be appended after the current content
 */
export function appendInItsOwnLine(previous, appended) {
  return (previous + "\n\n[[D]]" + appended)
    .replace(/(\n{2,})\[\[D\]\]/, "\n\n")
    .replace(/^(\n*)/, "");
}

/**
 * Inserts the given value at the current cursor position of the textarea element
 *
 * @param  {HtmlElement} el
 * @param  {String} value Text which will be inserted at the cursor position
 */
export function insertTextAtCursor(el, text) {
  var scrollPos = el.scrollTop,
    strPos = 0,
    browser = false,
    range;

  if ((el.selectionStart || el.selectionStart === '0')) {
    browser = "ff";
  } else if (document.selection) {
    browser = "ie";
  }

  if (browser === "ie") {
    el.focus();
    range = document.selection.createRange();
    range.moveStart('character', -el.value.length);
    strPos = range.text.length;
  } else if (browser === "ff") {
    strPos = el.selectionStart;
  }

  var front = (el.value).substring(0, strPos);
  var back = (el.value).substring(strPos, el.value.length);
  el.value = front + text + back;
  strPos = strPos + text.length;
  if (browser === "ie") {
    el.focus();
    range = document.selection.createRange();
    range.moveStart('character', -el.value.length);
    range.moveStart('character', strPos);
    range.moveEnd('character', 0);
    range.select();
  } else if (browser === "ff") {
    el.selectionStart = strPos;
    el.selectionEnd = strPos;
    el.focus();
  }
  el.scrollTop = scrollPos;
}
