import React, { Component } from 'react';
import { render } from 'react-dom';
import { SpectroEditor, SpectroSwitcher } from '../src';
import initialTree from './data/tree';
import './typebase.css';

/*
 * Step 1:
 *
 * Define editor components. They are used
 * both for final rendering and while editing
 * content
 */
import * as editorComponents from './components';

/**
 * Step 2:
 *
 * Create root editor component with some initial
 * data tree (e.g. JSON from server) and
 * provide set of components which required
 * to deserialize editor tree.
 */
class Editor extends Component {
    constructor (props, context) {
        super(props, context);

        this.state = {
            enabled: true,
            tree: initialTree,
            inspectTarget: null
        };
    }

    onToggle = (enabled) => {
        this.setState({ enabled });
    };

    onChange = (tree) => {
        this.setState({ tree });
    };

    onInspect = (target) => {
        this.setState({ target });
    };

    render () {
        return (
            <main>
                <SpectroSwitcher
                    onToggle={this.onToggle}
                    toggled={this.state.enabled}
                />
                <SpectroEditor
                    onChange={this.onChange}
                    onInspect={this.onInspect}
                    components={editorComponents}
                    enabled={this.state.enabled}
                    target={this.state.target}
                    tree={this.state.tree}
                />
            </main>
        );
    }
}

/**
 * Step 3:
 *
 * Render it!
 */
render(
    <Editor />,
    document.querySelector('[data-approot]')
);
