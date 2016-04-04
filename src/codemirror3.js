import InlineAttachment from './inline-attachment'
import CodeMirrorEditorCore from './codemirror-core'

/**
 * CodeMirror version for inlineAttachment
 *
 * Call new CodeMirror(editor, {}) to attach to a codemirror instance
 */
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

    this.codeMirror.setOption('onDragEvent', function(data, e) {
      if (e.type === "drop") {
        e.stopPropagation();
        e.preventDefault();
        return inlineattach.onDrop(e);
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

    codemirror3: {
      attach: function(input, options){
        return new CodeMirrorInlineAttachment(input, options)
      }
    }
  }
}
