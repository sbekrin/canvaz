![Spectro Logotype](http://i.imgur.com/5LI69Up.jpg)

Spectro is jQuery plugin made for visual, drag and drop, modular content management on websites.

# Features
- Customizable content structure via scheme file
- Drag and drop out of the box
- Clean and tidy HTML result
- Web components support

# Demo
Live demo avaible at http://dev.bekrin.me/spectro/.

# Plans
- [x] Move to gulp
- [x] Rewrite project via SASS, Jade and CoffeScript
- [x] Refractor jQuery plugin structure
- [x] Simple localization (i18n) support
- [x] Extensions support
- [ ] Scheme hotkeys support
- [ ] Create test schemes
- [ ] Develop Wordpress plugin
- [ ] Develop Joomla extension

# Sheme
Scheme is intuitive `*.xml` file, which describes possible element structure. It is required to be loaded before editing. See simple [scheme.xml](./build/scheme.xml).

| Attribute Name        | Status     | Description |
|-----------------------|------------|-------------|
| `spectro-label`       | ok         | Human-readable name for element wich will be shown instead of tag name               |
| `spectro-orientation` | ok         | This is Enum attribute with possible values of `vertical` and `horizontal` (default) |
| `spectro-icon`        | in work    | Preview icon for contents extension (could be any graphic, svg or png recommended)   |
| `spectro-hotkey`      | in work    | Hotkey set for quick element insertion                                               |
| `spectro-editable`    | deprecated | Boolean attribute for WYSIWYG-like editing. Replaced with wysiwyg extension          |
| `spectro-classes`     | deprecated | This attribute have been removed after contents extensions added                     |
| `spectro-attributes`  | deprecated | This attribute have been removed after contents extensions added                     |

Other attributes with `spectro-*` prefix are reserved. All other attributes will be copied to new element as defaults.

# Requirements
- jquery.js

# Usage
See [example](./build/) for simple use case.
