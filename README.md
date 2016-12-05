# Spectro Editor
Spectro is visual, modular content editor. Unlike any WYSIWYG-editors,
Spectro works with component tree instead of text. It provides extensibility
and great visual control of output.

> ⚠️ This is alpha project. Most features are unstable and not finished yet.

### Usage
#### 1. Install Spectro
```
npm install --save spectro-editor
```

#### 2. Define components you'll use for editing
You can use any rich component (like YouTube player or Twitter Embed).

```javascript
import React from 'react';
import { render } from 'react-dom';
import withSpectro, { SpectroEditor } from 'spectro-editor';

// You can also use @withSpectro as decorator
const Heading = withSpectro({
    label: 'Heading',
    textEditable: true
})(({ children }) => (
    <h2>{children}</h2>
));

const Paragraph = withSpectro({
    label: 'Paragraph',
    textEditable: true
})(({ children }) => (
    <p>{children}</p>
));

const ListItem = withSpectro({
    label: 'List Item',
    textEditable: true
})(({ children }) => (
    <li>{children}</li>
));

const List = withSpectro({
    label: 'List',
    accepts: [ ListItem ]
})(({ children }) => (
    <ul>{children}</ul>
));

const Article = withSpectro({
    label: 'Article',
    accepts: [ Heading, Paragraph, List ]
})(({ title, children }) => (
    <article>
        <h1>{title}</h1>
        <section>{children}</section>
    </article>
));
```

#### 3. Render editor container
Please note, that `components` prop is required and used to
deserialize JSON data from backend. This also makes possible
to render your content on other target platforms, like React
Native (yep, no more webview!).

```javascript
const initialTree = {
    type: 'Article',
    props: {
        title: 'WOW',
        children: [
            {
                type: 'Heading',
                props: {
                    children: 'Much React'
                }
            },
            {
                type: 'Paragraph',
                props: {
                    children: 'So modular'
                }
            }
        ]
    }
};

// You may want to send changes to backend (or to store in localStorage)
function onChange (newTree) {
    console.log('New tree is', newTree);
}

const Editor = () => (
    <SpectroEditor
        components={{
            Article,
            Heading,
            Paragraph,
            List,
            ListItem
        }}
        onChange={onChange}
        tree={initialTree}
        enabled
    />
);

render(<Editor />, document.querySelector('#app'));
```

## Development
It's recomended to develop while running example.
```bash
npm run example
```

To build UMD library, run `npm run build`.

## License
MIT © [Sergey Bekrin](https://github.com/sergeybekrin)
