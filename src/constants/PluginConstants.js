import createPropsPlugin from 'plugins/PropsPlugin';
import createContentsPlugin from 'plugins/ContentsPlugin';

export default {
    DEFAULT_PLUGINS: [
        createPropsPlugin,
        createContentsPlugin
    ]
};
