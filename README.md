![Spectro Logotype](http://i.imgur.com/SIhsB0y.jpg)

# About
Spectro is jQuery plugin with awesome features for visual, drag'n'drop, modular content editing across the web.
It mainly must-have replacement for WYSIWYG editors for news, blog or other content websites.
Another aim is clean, structured result.

Spectro supports web components. Tested with polymer, x-tag and vanilla js components.

### Demo
Live demo avaible at http://dev.bekrin.me/spectro/.

### Plans
- [x] Move to gulp
- [x] Rewrite project via SASS, Jade and CoffeScript
- [x] Enhance jQuery plugin structure quality
- [x] Remove web component helpers
- [ ] Create test schemes
- [ ] Commit to master

### Sheme
Scheme is intuitive `*.xml` file, which describes possible element structure. It is required to be loaded before editing. See simple [scheme.xml](./build/scheme.xml).

Special attributes are:
- `spectro-label` is human-readable label for element, which will be shown in path tree.
- `spectro-classes` is simple json-styled array with possible classes. Both single (checkbox) and group (select) classes possible.
- `spectro-attributes` is simple json-styled array with attributes avaible to change and their type.
- `spectro-editable` is boolean attribute, wich tells Spectro what contents of set element are inline and makes element contenteditable (by default only last children of DOM tree are editable).
- Other attributes with `spectro-*` prefix are reserved for future releases.

All other attributes will be copied to new element as defaults.

# Requirements
- jquery.js

# Usage
See [example](./build/) for simple use case.
