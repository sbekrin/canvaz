![Spectro Logotype](http://i.imgur.com/5LI69Up.jpg)

Spectro is visual, modular content management tool made for everyone.

# Features
- Customizable content structure via scheme file
- Drag and drop out of the box
- Clean and tidy HTML result
- Web components support

# Demo
Live demo avaible at http://dev.bekrin.me/spectro/.

# Plans
- [x] Simple localization (i18n) support
- [x] Extensions support
- [x] Bundle inline WYSIWYG extension
- [ ] Scheme hotkeys support
- [ ] Create test schemas
- [ ] Develop Wordpress plugin

# Scheme
Scheme is intuitive `*.xml` file, which describes possible element structure. It is required to be loaded before editing. See simple [scheme.xml](./build/scheme.xml).

| Attribute Name        | Status     | Description |
|-----------------------|------------|-------------|
| `spectro-label`       | ok         | Human-readable name for element wich will be shown instead of tag name               |
| `spectro-orientation` | ok         | This is Enum attribute with possible values of `vertical` and `horizontal` (default) |
| `spectro-icon`        | ok         | Preview icon, unicode symbol from icon font                                          |
| `spectro-hotkey`      | in work    | Hotkey set for quick element insertion                                               |

Other attributes with `spectro-*` prefix are reserved. All other attributes will be copied to new element as defaults.

# Requirements
- jquery.js

# Usage
See [example](./build/) for simple use case.
