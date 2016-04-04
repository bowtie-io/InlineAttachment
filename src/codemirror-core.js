export default class CodeMirrorEditorCore {
  constructor(instance, options) {
    if (!instance.getWrapperElement) {
      throw "Invalid CodeMirror object given";
    }

    this.codeMirror = instance;
    this.options = options || {};
    this.attach()
  }

  getValue() {
    return this.codeMirror.getValue();
  }

  insertValue(val) {
    this.codeMirror.replaceSelection(val);
  }

  setValue(val) {
    var cursor = this.codeMirror.getCursor();
    this.codeMirror.setValue(val);
    this.codeMirror.setCursor(cursor);
  }
}
