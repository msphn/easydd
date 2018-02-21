/**
 * Easy Drag and Drop Zone
 *
 * @author Michael F. Spahn <michael@spahn.me>
 * @license https://www.gnu.org/licenses/agpl-3.0.html GNU Affero Public License Version 3
 */
easydd = function (c) {
    this.context = document.getElementById(c.elementId);
    this.config = c;

    if (this.config.text) {
        this.setText(this.config.text);
    }

    if (this.context !== undefined) {
        this.context.addEventListener('dragover', function (evt) {
            this.onDragover(evt);
        }.bind(this), false);

        this.context.addEventListener('drop', function (evt) {
            if (typeof this.config.callback !== 'function') {
                this.config.callback = function (data) {
                };
            }

            this.onDrop(evt, this);
        }.bind(this), false);

        this.context.addEventListener('click', function (evt) {
            this.onClick(evt);
        }.bind(this), false);

        this.context.classList.add('easyDD');
    }
};
easydd.prototype = {
    /**
     * Div Element to render drop zone to
     *
     * @private
     * @type {null}
     */
    context: null,

    /**
     * Text span inside the drop zone
     *
     * @private
     * @type {null}
     */
    span: null,

    /**
     * Hidden input field
     *
     * @private
     * @type {null}
     */
    hiddenInput: null,

    /**
     * Config
     *
     * @private
     * @type {{}}
     */
    config: {},

    /**
     * Contains all uploaded files
     *
     * @private
     * @type {Array}
     */
    fileData: [],

    /**
     * Event listener if drag over
     *
     * @private
     * @param evt
     */
    onDragover: function (evt) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy';
    },

    /**
     * Event listener on drop
     *
     * @private
     * @param evt
     */
    onDrop: function (evt) {
        var files;

        evt.stopPropagation();
        evt.preventDefault();

        if (evt.dataTransfer) {
            files = evt.dataTransfer.files;
        } else {
            files = evt.target.files;
        }

        for (var i = 0; i < files.length; i++) {
            this.saveFileDataToArray(files[i]);
        }
    },


    /**
     * Returns a array of every submitted file
     *
     * @public
     * @returns {Array}
     */
    getData: function () {
        return this.fileData;
    },

    /**
     * @private
     */
    saveFileDataToArray: function (data) {
        var reader = new FileReader(),
            me = this;

        try {
            reader.onload = (function (file) {
                return function (e) {
                    // Check for mimetype if enabled
                    if (me.config.allowedMimeTypes.length > 0) {
                        if (me.config.allowedMimeTypes.indexOf(file.type) === -1) {
                            me.config.callback(-1);
                            return;
                        }
                    }

                    // Check for filesize if enabled
                    if (me.config.maxSize > 0) {
                        if ((file.size / 1024) > me.config.maxSize) {
                            me.config.callback(-2);
                            return;
                        }
                    }

                    me.config.callback(e.target.result);
                    me.fileData.push(e.target.result);
                };
            })(data);

            reader.readAsDataURL(data);
        } catch (e) {
            console.warn('Something went wrong.');
        }
    },

    /**
     * Render hidden input field to fake file upload on click
     *
     * @private
     */
    addHiddenInput: function () {
        if (this.hiddenInput === null) {
            this.hiddenInput = document.createElement('input');
            this.hiddenInput.setAttribute('name', 'easyddHI');
            this.hiddenInput.setAttribute('type', 'file');
            this.hiddenInput.setAttribute('id', 'easyddHi');
            this.hiddenInput.multiple = true;
            this.context.appendChild(this.hiddenInput);

            this.hiddenInput.addEventListener('change', function (evt) {
                this.onDrop(evt);
            }.bind(this), false);
        }
    },

    /**
     * Event listener on click
     *
     * @private
     * @param evt
     */
    onClick: function (evt) {
        this.addHiddenInput();
        this.hiddenInput.click();
        this.hiddenInput = null;
    },

    /**
     * Set text on dropzone
     *
     * @public
     * @param text
     */
    setText: function (text) {
        if (this.span == null) {
            this.span = document.createElement('span');
            this.span.classList.add('easyDDspan');
            this.context.appendChild(this.span);
        }

        this.span.innerHTML = text;
    }
};