/**
 * Easy Drag and Drop Zone
 *
 * @author Michael F. Spahn <kontakt@michaelspahn.de>
 * @license https://www.gnu.org/licenses/agpl-3.0.html GNU Affero Public License Version 3
 */
window.easydd = function () {
    /**
     * Div Element to render drop zone to
     *
     * @private
     * @type {null}
     */
    easyDD.prototype.context = null;

    /**
     * Text span inside the drop zone
     *
     * @private
     * @type {null}
     */
    easyDD.prototype.span = null;

    /**
     * Hidden input field
     *
     * @private
     * @type {null}
     */
    easyDD.prototype.hiddenInput = null;

    /**
     * Config
     *
     * @private
     * @type {{}}
     */
    easyDD.prototype.config = {};

    /**
     * Contains all uploaded files
     *
     * @private
     * @type {Array}
     */
    easyDD.prototype.fileData = [];

    /**
     * Constructor
     *
     * @param c
     */
    function easyDD(c) {
        this.context = document.getElementById(c.elementId);
        this.config = c;

        if (this.config.text) {
            this.setText(this.config.text);
        }

        if (this.context !== undefined) {
            this.context.addEventListener('dragover', function (evt) {
                this.onDragover(evt, this);
            }.bind(this), false);

            this.context.addEventListener('drop', function (evt) {
                if (typeof this.config.callback === 'function') {
                    var cb = this.config.callback;
                } else {
                    var cb = function (data) {};
                }

                this.onDrop(evt, this, cb);
            }.bind(this), false);

            this.context.addEventListener('click', function (evt) {
                this.onClick(evt);
            }.bind(this), false);

            this.context.classList.add('easyDD');
        }
    }

    /**
     * Event listener if drag over
     *
     * @private
     * @param evt
     */
    easyDD.prototype.onDragover = function (evt) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy';
    };

    /**
     * Event listener on drop
     *
     * @private
     * @param evt
     */
    easyDD.prototype.onDrop = function (evt, that, cb) {
        evt.stopPropagation();
        evt.preventDefault();

        if (evt.dataTransfer) {
            var files = evt.dataTransfer.files;

        } else {
            var files = evt.target.files;
        }

        for (var i = 0; i < files.length; i++) {
            this.saveFileDataToArray(files[i], that, cb);
        }
    };


    /**
     * Returns a array of every submitted file
     *
     * @public
     * @returns {Array}
     */
    easyDD.prototype.getData = function () {
        return this.fileData;
    };

    /**
     * @private
     */
    easyDD.prototype.saveFileDataToArray = function (data, that, cb) {
        var reader = new FileReader();

        try {
            reader.onload = (function (file) {
                return function (e) {
                    // Check for mimetype if enabled
                    if (that.config.allowedMimeTypes.length > 0) {
                        if (that.config.allowedMimeTypes.indexOf(file.type) === -1) {
                            cb(-1);
                            return;
                        }
                    }

                    // Check for filesize if enabled
                    if (that.config.maxSize > 0) {
                        if ((file.size / 1024) > that.config.maxSize) {
                            cb(-2);
                            return;
                        }
                    }

                    cb(e.target.result);
                    that.fileData.push(e.target.result);
                };
            })(data);

            reader.readAsDataURL(data);
        } catch (e) {
            console.warn('Something went wrong.');
        }
    };

    /**
     * Render hidden input field to fake file upload on click
     *
     * @private
     */
    easyDD.prototype.addHiddenInput = function () {
        if (this.hiddenInput === null) {
            this.hiddenInput = document.createElement('input');
            this.hiddenInput.setAttribute('name', 'easyddHI');
            this.hiddenInput.setAttribute('type', 'file');
            this.hiddenInput.setAttribute('id', 'easyddHi');
            this.context.appendChild(this.hiddenInput);

            this.hiddenInput.addEventListener('change', function (evt) {
                if (typeof this.config.callback === 'function') {
                    var cb = this.config.callback;
                } else {
                    var cb = function (data) {};
                }

                this.onDrop(evt, this, cb);
            }.bind(this), false);
        }
    };

    /**
     * Event listener on click
     *
     * @private
     * @param evt
     */
    easyDD.prototype.onClick = function (evt) {
        this.addHiddenInput();
        this.hiddenInput.click();
    };

    /**
     * Set text on dropzone
     *
     * @public
     * @param text
     */
    easyDD.prototype.setText = function (text) {
        if (this.span == null) {
            this.span = document.createElement('span');
            this.span.classList.add('easyDDspan');
            this.context.appendChild(this.span);
        }

        this.span.innerHTML = text;
    };

    var easydd = {
        create: function (c) {
            return new easyDD(c);
        }
    };
    return easydd;
}();