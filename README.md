# travis-target [![Build Status](https://travis-ci.org/shellscape/travis-target.svg?branch=master)](https://travis-ci.org/shellscape/travis-target)

This module is used to determine the target files or directories of a
Travis CI build. It accomplishes that by examining the git history for
repository being tested, and comparing the current git commit hash with
the last hash on `origin/master`.

## Getting Started

First thing's first, install the module:

```bash
npm install travis-target --save-dev
```

```js
const { target } = require('travis-target');

let options = {};
let targets = await target(options);
```

## Requirements

Node.js version 7 or higher is recommended. This module makes use of
`async` / `await` patterns. Code using this module should be run as such:

```bash
node --harmony-async-await app
```

Or you can use [harmonize](https://www.npmjs.com/package/harmonize) at the start
of your app entry point file:

```js
require('harmonize')(['harmony-async-await']);
```

If you can't use version 7, use [Babel.js](babeljs.io) to handle runtime
transpilation. My pattern is to use an `index.js` file which sets up Babel
and calls out to the app entry point:

```
require('babel-core/register');
require('babel-polyfill');
require('./app');
```

## `target` Options

The module's `target` accepts an `options` Object, which can contain options for the
`webpack-dev-middleware` and `webpack-hot-middleware` bundled with this module.
The following is a property reference for the Object:

### map

Type: `Function`  
`optional`

Should you have the need to perform advanced mapping of the results,
specify a `function` for the `map` property which accepts a lone `target`
parameter.

Example:

```js
const { target } = require('travis-target');

let options = { map: (target) => { ... } };
let targets = await target(options);
```

### pattern

Type: `RegExp`  
`optional`

If you'd like the target results to be filtered by a particular
pattern, assign a regular expression to this property, and the
results will only contain targets which match the pattern.

Example:

```js
const { target } = require('travis-target');

// only return targets that begin with 'src/'
let options = { pattern: /^src\//gi };
let targets = await target(options);
```

## Testing

```bash
npm install
npm install gulp -g
gulp
```

## Contributing

We welcome your contributions! Please have a read of [CONTRIBUTING](CONTRIBUTING.md).
