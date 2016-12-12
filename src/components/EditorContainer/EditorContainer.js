/* @flow */
import type { Element as ReactElement } from 'react';
import { Component, cloneElement } from 'react';
import type { TreeNode, ComponentsMapping } from 'types/EditorTypes';
import { createGlobalStyles, destroyGlobalStyles } from 'utils/GlobalStyleUtils';
import { deserialize } from 'utils/SerializationUtils';
import { createFromObject } from 'utils/EditorStateUtils';
import { destroyToolbar } from '../../toolbar';

type DefaultProps = {
    enabled: boolean,
    components: ComponentsMapping,
    tree: TreeNode
};

type Props = {
    enabled: boolean,
    components: ComponentsMapping,
    tree: TreeNode,
    target: Object,
    onChange: () => TreeNode,
    onInspect: () => Object
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
            destroyToolbar();
        }
    }

    props: Props;

    render (): ReactElement<any> {
        const {
            enabled,
            tree,
            components,
            target,
            onChange,
            onInspect } = this.props;
        const renderedElement = deserialize(tree, components);
        const extraProps = {
            editorState: createFromObject({
                enabled,
                tree,
                target,
                onChange,
                onInspect
            })
        };

        return cloneElement(renderedElement, extraProps);
    }
}

export default EditorContainer;
