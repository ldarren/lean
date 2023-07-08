# Lean JavaScript Library

Lean is a lightweight JavaScript library that provides various utility functions and features for web development. It includes functionality for handling events, local storage, DOM manipulation, AJAX requests, and more.

## Features

- **Event Handling**: Lean provides event handling functions to simplify event management. It includes support for common events such as click, tap, long tap, and more.

- **Local Storage**: Lean offers a simple API for working with local storage. It supports both the native `localStorage` API and the `sqlitePlugin` for SQLite-based local storage.

- **DOM Manipulation**: Lean provides functions for creating and manipulating DOM elements. It allows you to set element attributes, classes, styles, and content easily.

- **AJAX Requests**: Lean includes a lightweight AJAX function for making HTTP requests. It supports GET, POST, PUT, DELETE, and PATCH methods and provides options for handling query parameters, headers, and more.

For making AJAX requests in Node.js, you can use the ajax function provided by the [picos-util](https://github.com/ldarren/picos-util) library. The ajax function in picos-util has the same input parameters and output response format as the AJAX function in Lean.

## Installation

build commands
* ./build # compile less to css
* ./concat < output.js > < src/dir > # combine js files to single js

To use Lean in your project, include the `lean.min.js` file in your HTML:

```html
<script src="path/to/lean.min.js"></script>
```

## Usage

Here's an example of how to use some of the features provided by Lean:

```javascript
// Event Handling
document.addEventListener('click', function(event) {
  console.log('Clicked:', event.target);
});

// Local Storage
__.store('localstorage').setItem('username', 'John Doe', function(error, id) {
  if (error) {
    console.error('Error:', error);
    return;
  }
  console.log('Item saved with ID:', id);
});

__.store('localstorage').getItem('username', function(error, value) {
  if (error) {
    console.error('Error:', error);
    return;
  }
  console.log('Username:', value);
});

// DOM Manipulation
var element = __.dom.get({ tag: 'div', id: 'my-element', content: 'Hello, world!' });
document.body.appendChild(element);

// AJAX Requests
__.ajax('get', 'https://api.example.com/data', null, {}, function(error, state, responseBody, response, userData) {
	if (state !== 4) return // for response streaming
  if (error) {
    console.error('Error:', error);
    return;
  }
  console.log('Response:', responseBody);
}, userData);
```

Note: The above code is a minified version of Lean. It's recommended to use the unminified version during development for better readability and debugging.

## Documentation

For detailed documentation and usage examples, refer to the [Lean GitHub repository](https://github.com/ldarren/lean)

## License

Lean is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
