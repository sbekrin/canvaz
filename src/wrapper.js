/* @flow */
import type { Element as ReactElement } from 'react';
import React, { Component, cloneElement } from 'react';
import type { SpectroConfig } from 'types/EditorTypes';
import { getDisplayName, isSpectroEnhanced } from './helpers';

type Props = {
    parentHasFocus: boolean,
    children: Array<ReactElement<any>>
};

type State = {
    hasNodeRef: boolean,
    hasFocus: boolean
};

export default function createWrapper (spectro: SpectroConfig) {
    return function wrap (SpectroEnhancer: Function): constructor {
        return class SpectroHOC extends Component<any, Props, any> {
            static displayName = `Spectro(${getDisplayName(SpectroEnhancer)})`;

            // Keep reference to original SpectroEnhancer for quick comparison
            // then doing drag and drop dropzone check
            static _spectroEnhancer = SpectroEnhancer;

            state: State;

            constructor (props: Props, context: ?any) {
                super(props, context);

                this.state = {
                    hasNodeRef: false,
                    hasFocus: false
                };
            }

            _node: SpectroEnhancer = null;

            _keepRef = (node: ReactElement<any>): void => {
                if (node) {
                    this.setState({ hasNodeRef: true });
                    this._node = node;
                }
            };

            _onParentFocus = (): void => {
                this._node._spectroFocus();
            };

            _onFocus = (): void => {
                this.setState({ hasFocus: true });
            };

            _onBlur = (): void => {
                this.setState({ hasFocus: false });
            };

            render () {
                const props = {};
                const parentLabel = spectro.label;
                const parentHasFocus = (
                    this.props.parentHasFocus ||
                    this.state.hasFocus
                );

                // Once ref is received, extend children props
                // with parent label, parent focus flag and
                // callback on parent focus request
                if (this.state.hasNodeRef && Array.isArray(this.props.children)) {
                    props.children = this.props.children.map((child) => (
                        isSpectroEnhanced(child) ?
                        cloneElement(child, {
                            parentLabel,
                            parentHasFocus,
                            onParentFocus: this._onParentFocus
                        }) :
                        child
                    ));
                }

                return (
                    <SpectroEnhancer
                        {...this.props}
                        {...props}
                        onFocus={this._onFocus}
                        onBlur={this._onBlur}
                        ref={this._keepRef}
                    />
                );
            }
        };
    };
}
