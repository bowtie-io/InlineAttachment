/**
 * CodeMirror version for inlineAttachment
 *
 * Call new CodeMirror(editor, {}) to attach to a codemirror instance
 */

import InlineAttachment from './inline-attachment'
import CodeMirrorEditorCore from './codemirror-core'

export class CodeMirrorInlineAttachment extends CodeMirrorEditorCore {
  /**
   * Attach InlineAttachment to CodeMirror
   *
   * @param {CodeMirror} codeMirror
   */
  attach() {
    var inlineattach = new InlineAttachment(this, this.options),
      el = this.codeMirror.getWrapperElement();

    el.addEventListener('paste', function(e) {
      inlineattach.onPaste(e);
    }, false);

    this.codeMirror.on('drop', function(data, e) {
      if (inlineattach.onDrop(e)) {
        e.stopPropagation();
        e.preventDefault();
        return true;
      } else {
        return false;
      }
    });
  }
}

// Backwards compatibility

window.inlineAttachment = {
  editors: {
    codemirror: {
      attach: function(input, options){
        return new CodeMirrorInlineAttachment(input, options)
      }
    },

    codemirror4: {
      attach: function(input, options){
        return new CodeMirrorInlineAttachment(input, options)
      }
    }
  }
}
