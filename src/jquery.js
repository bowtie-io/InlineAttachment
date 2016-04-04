/**
 * jQuery plugin for inline attach
 *
 * @param {document} document
 * @param {window} window
 * @param {jQuery} $
 */

import jQuery from 'jquery'
import InlineAttachment from './inline-attachment'
import { insertTextAtCursor } from './util'

class jQueryInlineAttachment {
  constructor(instance, options) {
    this.instance = jQuery(instance)
    this.options = options
    this.attach()
  }

  attach() {
    var inlineattach = new InlineAttachment(this, this.options)

    this.instance.bind({
      'paste': function(e) {
        inlineattach.onPaste(e.originalEvent);
      },
      'drop': function(e) {
        e.stopPropagation();
        e.preventDefault();
        inlineattach.onDrop(e.originalEvent);
      },
      'dragenter dragover': function(e) {
        e.stopPropagation();
        e.preventDefault();
      }
    })
  }

  getValue() {
    return this.instance.val()
  }

  insertValue(val) {
    insertTextAtCursor(this.instance, val);
  }

  setValue(val) {
    this.instance.val(val)
  }
}

jQuery.fn.inlineattachment = function(options) {
  var set = jQuery(this)

  set.each(function() {
    var $this = jQuery(this)
    new jQueryInlineAttachment($this, options)
  });

  return this;
};
