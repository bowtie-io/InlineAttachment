import InlineAttachment from './inline-attachment'
import { insertTextAtCursor } from './util'

export class InputInlineAttachment {
  constructor(input, options) {
    this.input = input
    this.options = options

    this.attach()
  }

  attach() {
    const inlineattach = new InlineAttachment(this, this.options)

    this.input.addEventListener('paste', function(e) {
      inlineattach.onPaste(e)
    }, false)
    this.input.addEventListener('drop', function(e) {
      e.stopPropagation()
      e.preventDefault()
      inlineattach.onDrop(e)
    }, false);
    this.input.addEventListener('dragenter', function(e) {
      e.stopPropagation()
      e.preventDefault()
    }, false);
    this.input.addEventListener('dragover', function(e) {
      e.stopPropagation()
      e.preventDefault()
    }, false);
  }

  getValue() {
    return this.input.value
  }

  insertValue(val) {
    return insertTextAtCursor(this.input, val)
  }

  setValue(val) {
    this.input.value = val
  }
}

// Backwards compatibility

window.inlineAttachment = {
  editors: {
    input: {
      attachToInput: function(input, options){
        return new InputInlineAttachment(input, options)
      },

      attach: function(input, options){
        return new InputInlineAttachment(input, options)
      }
    }
  }
}
