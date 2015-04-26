# EasyDD - Easy Drop Zone
This library provides a easy drop zone without losing control of the data.

Like to see the demo live? http://cookiekiller.github.io/easydd/

# Features

* Drop one ore more files to a dropzone
* Define maximum filesize
* Define allowed mime types
* No ajax just getting data from a dropzone
* Upload files by clicking at the dropzone

# Use it
It's easy, just include src/easydd.js and easydd.css in your HTML.

Create an empty div and give it an id.

Initialize is like that:
```javascript
    // Initialize easyDD
    var dd = easydd.create({
        // HTML ID of an existing div to render to
        elementId: 'dd',
        // Centered text inside the div?
        text: 'Drop or Click here!',
        // Max file size in kb
        maxSize: 250,
        // Array of allowed mimetypes
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif'],
        // Callback function see callbackTest above
        callback: callbackTest
    });
```

And to use all these awesome data you receive, add a callback function in the callback parameter.

If you don't like limits, just remove maxSize and allowedMimeTypes, every file will be passed now to your callback function.

# Composer
If you like to get the latest version automatically, just add the composer repository.

`composer require cookiekiller/easydd @dev-master`

# Works with
I verified:
* Firefox 37+
* Chrome 42+
* Midori 0.5.9 (Apple WebKit)

Haven't tested with any other browser yet.

# Contributing?
Please support that library by testing and improving.
