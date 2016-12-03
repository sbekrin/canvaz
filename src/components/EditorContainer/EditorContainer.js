/* @flow */
import type { Element as ReactElement } from 'react';
import { Component, cloneElement } from 'react';
import type { TreeNode, ComponentsMapping } from 'types/EditorTypes';
import { createGlobalStyles, destroyGlobalStyles } from 'utils/GlobalStyleUtils';
import { deserialize } from 'utils/SerializationUtils';
import { createFromObject } from 'utils/EditorStateUtils';

type DefaultProps = {
    enabled: boolean,
    components: ComponentsMapping,
    tree: TreeNode
};

type Props = {
    enabled: boolean,
    components: ComponentsMapping,
    tree: TreeNode,
    onChange: Function
};

class EditorContainer extends Component {
    static defaultProps: DefaultProps = {
        enabled: false,
        components: {},
        tree: {}
    };

    constructor (props: Props, context: any) {
        super(props, context);

        if (props.enabled) {
            createGlobalStyles();
        }
    }

    componentDidUpdate (): void {
        if (this.props.enabled) {
            createGlobalStyles();
        } else {
            destroyGlobalStyles();
        }
    }

    props: Props;

    render (): ReactElement<any> {
        const { enabled, tree, components, onChange } = this.props;
        const renderedElement = deserialize(tree, components);
        const extraProps = { editorState: createFromObject({ enabled, tree, onChange }) };


        return cloneElement(renderedElement, extraProps);
    }
}

export default EditorContainer;
