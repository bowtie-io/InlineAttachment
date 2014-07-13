/*jslint newcap: true */
/*global XMLHttpRequest: false, FormData: false */
/*
 * Inline Text Attachment
 *
 * Author: Roy van Kaathoven
 * Contact: ik@royvankaathoven.nl
 */
var inlineAttachment = function(options, instance) {
  this.settings = inlineAttachment.util.merge(options, inlineAttachment.defaults);
  this.editor = instance;
  this.filenameTag = '{filename}';
  this.lastValue = null;
};

/**
 * Will holds the available editors
 *
 * @type {Object}
 */
inlineAttachment.editors = {};

/**
 * Utility functions
 */
inlineAttachment.util = {

  /**
   * Simple function to merge the given objects
   *
   * @param {Object[]} object Multiple object parameters
   * @returns {Object}
   */
  merge: function() {
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
  },

  /**
   * Append a line of text at the bottom, ensuring there aren't unnecessary newlines
   *
   * @param {String} appended Current content
   * @param {String} previous Value which should be appended after the current content
   */
  appendInItsOwnLine: function(previous, appended) {
    return (previous + "\n\n[[D]]" + appended)
      .replace(/(\n{2,})\[\[D\]\]/, "\n\n")
      .replace(/^(\n*)/, "");
  }
};

/**
 * Default configuration options
 *
 * @type {Object}
 */
inlineAttachment.defaults = {
  /**
   * URL where the file will be send
   */
  uploadUrl: 'upload_attachment.php',

  /**
   * Name in which the file will be placed
   */
  uploadFieldName: 'file',

  /**
   * JSON field which refers to the uploaded file URL
   */
  jsonFieldName: 'filename',

  /**
   * Allowed MIME types
   */
  allowedTypes: [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'image/gif'
  ],

  /**
   * Text which will be inserted when dropping or pasting a file.
   * Acts as a placeholder which will be replaced when the file is done with uploading
   */
  progressText: '![Uploading file...]()',

  /**
   * When a file has successfully been uploaded the progressText
   * will be replaced by the urlText, the {filename} tag will be replaced
   * by the filename that has been returned by the server
   */
  urlText: "![file]({filename})",

  /**
   * Text which will be used when uploading has failed
   */
  errorText: "Error uploading file",

  /**
   * Extra parameters which will be send when uploading a file
   */
  extraParams: {},

  /**
   * Triggers when a file is dropped or pasted
   */
  onFileReceived: function() {},

  /**
   * Custom upload handler
   *
   * @return {Boolean} when false is returned it will prevent default upload behavior
   */
  onFileUploadResponse: function(responseText) {
    return true;
  },

  /**
   * Custom error handler. Runs after removing the placeholder text and before the alert().
   * Return false from this function to prevent the alert dialog.
   *
   * @return {Boolean} when false is returned it will prevent default error behavior
   */
  onFileUploadError: function() {
    return true;
  },

  /**
   * When a file has succesfully been uploaded
   */
  onUploadedFile: function() {}
};

/**
 * Uploads the blob
 *
 * @param  {Blob} file blob data received from event.dataTransfer object
 * @return {XMLHttpRequest} request object which sends the file
 */
inlineAttachment.prototype.uploadFile = function(file) {
  var me = this,
    formData = new FormData(),
    xhr = new XMLHttpRequest(),
    settings = this.settings,
    extension = 'png';

  // Attach the file. If coming from clipboard, add a default filename (only works in Chrome for now)
  // http://stackoverflow.com/questions/6664967/how-to-give-a-blob-uploaded-as-formdata-a-file-name
  if (file.name) {
    var fileNameMatches = file.name.match(/\.(.+)$/);
    if (fileNameMatches) {
      extension = fileNameMatches[1];
    }
  }

  formData.append(settings.uploadFieldName, file, "image-" + Date.now() + "." + extension);

  // Append the extra parameters to the formdata
  if (typeof settings.extraParams === "object") {
    for (var key in settings.extraParams) {
      if (settings.extraParams.hasOwnProperty(key)) {
        formData.append(key, settings.extraParams[key]);
      }
    }
  }

  xhr.open('POST', settings.uploadUrl);
  xhr.onload = function() {
    // If HTTP status is OK or Created
    if (xhr.status === 200 || xhr.status === 201) {
      settings.onFileUploadResponse(xhr);
    } else {
      settings.onFileUploadError(xhr);
    }
  };
  xhr.send(formData);
  return xhr;
};

/**
 * Returns if the given file is allowed to handle
 *
 * @param {File} clipboard data file
 */
inlineAttachment.prototype.isFileAllowed = function(file) {
  return this.settings.allowedTypes.indexOf(file.type) >= 0;
};

/**
 * Handles upload response
 *
 * @param  {XMLHttpRequest} xhr
 * @return {Void}
 */
inlineAttachment.prototype.onFileUploadResponse = function(xhr) {
  var result = JSON.parse(xhr.responseText),
    filename = result[settings.jsonFieldName];

  if (result && filename) {
    var newValue = this.settings.urlText.replace(this.filenameTag, filename);
    var text = this.editor.getValue().replace(this.lastValue, newValue);
    editor.setValue(text);
  }
};


/**
 * Called when a file has failed to upload
 * @return {Void}
 */
inlineAttachment.prototype.onFileUploadError = function() {
  var text = editor.getValue().replace(this.lastValue, "");
  editor.setValue(text);
};

/**
 * Called when a file has been inserted, either by drop or paste
 *
 * @param  {File} file
 * @return {Void}
 */
inlineAttachment.prototype.onFileInserted = function(file) {
  var result = this.settings.onFileReceived(file),
    util = inlineAttachment.util;

  if (result !== false) {
    this.lastValue = this.settings.progressText;
    this.editor.setValue(util.appendInItsOwnLine(editor.getValue(), this.lastValue));
  }
};


/**
 * Called when a paste event occured
 * @param  {Event} e
 * @return {Boolean} if the event was handled
 */
inlineAttachment.prototype.onPaste = function(e) {
  var result = false,
    clipboardData = e.clipboardData,
    items;

  if (typeof clipboardData === "object") {
    items = clipboardData.items || clipboardData.files || [];

    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (this.isFileAllowed(item)) {
        result = true;
        this.onFileInserted(item.getAsFile());
        this.uploadFile(item.getAsFile());
      }
    }
  }

  return result;
};

/**
 * Called when a drop event occures
 * @param  {Event} e
 * @return {Boolean} if the event was handled
 */
inlineAttachment.prototype.onDrop = function(e) {
  var result = false;
  for (var i = 0; i < e.dataTransfer.files.length; i++) {
    var file = e.dataTransfer.files[i];
    if (this.isFileAllowed(file)) {
      result = true;
      this.onFileInserted(file);
      this.uploadFile(file);
    }
  }

  return result;
};