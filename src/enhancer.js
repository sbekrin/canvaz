/* @flow */
import type { Element as ReactElement } from 'react';
import invariant from 'invariant';
import React, { PropTypes, cloneElement } from 'react';
import {
    unmountComponentAtNode,
    unstable_renderSubtreeIntoContainer as renderSubtreeIntoContainer } from 'react-dom';
import type {
    SpectroConfig,
    SpectroState,
    TreeNode,
    NodeKey,
    SelectionData } from 'types/EditorTypes';
import type { ClipboardEvent, FocusEvent } from 'types/EventTypes';
import { getElementBox } from 'utils/ElementBoxUtils';
import { convertPastedTextToPlainText } from 'utils/ClipboardUtils';
import { validateSpectroConfig } from 'utils/SpectroConfigUtils';
import { saveSelection, restoreSelection } from 'utils/SelectionUtils';
import EditorControlBar from 'components/EditorControlBar';
import StyleConstants from 'constants/StyleConstants';
import PluginConstants from 'constants/PluginConstants';
import styles from 'constants/EnhancerStyles';
import { renderPlaceholder, destroyPlaceholder } from './placeholder';
import { renderToolbar } from './toolbar';
import { convertToClassComponent, getDisplayName } from './helpers';
import {
    getNodePath,
    getNodeIndex,
    getNode,
    updateNodeAtPath,
    removeNodeAtPath,
    mergeNodes,
    moveNodeAtPath } from './tree';

type Props = {
    editorState: ?SpectroState,
    children: any,
    spectroKey: string,
    parentLabel: string,
    parentHasFocus: boolean,
    onParentFocus: () => void,
    onFocus: () => void,
    onBlur: () => void
};

type State = {
    _spectroIsRoot: boolean,
    _spectroHasFocus: boolean,
    _spectroHasPointerOver: boolean,
    _spectroIsBeingDragged: boolean,
    _spectroIsBeingInspected: boolean
};

type Context = {
    spectro: SpectroState
};

export default function createEnhancer (spectro: SpectroConfig): Function {
    return function enhance (component: Function | ReactClass<any>): ReactClass<any> {
        const ComposedComponent: ReactClass<any> = convertToClassComponent(component);

        return class SpectroEnhancer extends ComposedComponent {
            static displayName = getDisplayName(ComposedComponent);

            static contextTypes = {
                ...ComposedComponent.contextTypes,
                spectro: PropTypes.object
            };

            static childContextTypes = {
                ...ComposedComponent.childContextTypes,
                spectro: PropTypes.object
            };

            props: Props;
            state: State;
            context: Context;
            _spectroSelection: ?SelectionData;
            _childrenRef: ?HTMLElement;
            _controlBarRef: ?HTMLElement;

            constructor (props: Props, context: Context) {
                super(props, context);

                this.state = {
                    ...super.state,
                    _spectroIsRoot: Boolean(this.props.editorState),
                    _spectroHasFocus: false,
                    _spectroHasPointerOver: false,
                    _spectroIsBeingDragged: false,
                    _spectroIsBeingInspected: false
                };

                // Pass down `editorState` prop as context on mount
                if (!context.spectro && props.editorState) {
                    this.context.spectro = props.editorState;
                }

                invariant(
                    this.context.spectro,
                    'Make sure to pass `editorStore` prop to SpectroEditor'
                );

                invariant(
                    this.props.spectroKey,
                    `Required \`spectroKey\` prop is missing on ${this.constructor.displayName}`
                );

                validateSpectroConfig(spectro);
            }

            componentWillReceiveProps (nextProps: Props, nextContext: Context) {
                if (super.componentWillReceiveProps) {
                    super.componentWillReceiveProps(nextProps, nextContext);
                }

                // Pass down `editorState` prop as context on updates
                if (nextProps.editorState) {
                    this.context.spectro = nextProps.editorState;
                }

                // Set state if current component being inspected
                this.setState({
                    _spectroIsBeingInspected: nextContext.spectro.target === this
                });
            }

            componentDidUpdate (
                prevProps: Props,
                prevState: State,
                prevContext: ?Context
            ): void {
                if (super.componentDidUpdate) {
                    super.componentDidUpdate(prevProps, prevState, prevContext);
                }

                if (this.context.spectro.enabled) {
                    this.renderControlbar();
                    this.renderToolbar();

                    // Restore selection for textEditable component,
                    // this is required for IE (Edge?) and Firefox
                    // Chrome and Safari handles this by default
                    const hasChanged = prevProps.children !== this.props.children;
                    const canRestoreSelection = this._childrenRef && this._spectroSelection;

                    if (spectro.textEditable && hasChanged && canRestoreSelection) {
                        // $FlowFixMe
                        restoreSelection(this._childrenRef, this._spectroSelection);
                        this._spectroSelection = null;
                    }
                } else {
                    this.destroyControlBar();
                }
            }

            componentWillUnmount (): void {
                if (super.componentWillUnmount) {
                    super.componentWillUnmount();
                }

                this.destroyControlBar();
            }

            shouldComponentUpdate (
                nextProps: Props,
                nextState: State,
                nextContext: Context
            ): boolean {
                if (!this.context.spectro.enabled && super.shouldComponentUpdate) {
                    return super.shouldComponentUpdate(nextProps, nextState, nextContext);
                }

                return true;
            }

            getChildContext (): Context {
                const superChildContext = (
                    super.getChildContext ?
                    super.getChildContext() :
                    {}
                );

                return {
                    ...superChildContext,
                    spectro: this.props.editorState || this.context.spectro
                };
            }

            destroyControlBar (): void {
                if (!this._controlBarRef) {
                    return;
                }

                const controlBar: Node = this._controlBarRef;
                unmountComponentAtNode(controlBar);
                document.body.removeChild(controlBar);
                this._controlBarRef = null;
            }

            renderControlbar (): void {
                if (!this._childrenRef) {
                    return;
                }

                // Create portal for control bar
                if (!this._controlBarRef) {
                    this._controlBarRef = document.createElement('div');
                    this._controlBarRef.dataset.spectro = 'controls';
                    document.body.appendChild(this._controlBarRef);
                }

                const isNotRoot: boolean = !this.state._spectroIsRoot;
                const isVisible: boolean = (
                    !this.context.spectro.dragAndDrop &&
                    (this.state._spectroHasFocus || this.state._spectroHasPointerOver)
                );

                renderSubtreeIntoContainer(
                    this,
                    <EditorControlBar
                        label={spectro.label}
                        parentLabel={this.props.parentLabel}
                        targetRef={this._childrenRef}
                        visible={isVisible}
                        canGoUp={isNotRoot}
                        canDrag={isNotRoot}
                        canRemove={isNotRoot}
                        onUp={this.onParentFocus}
                        onInspect={this.onInspect}
                        onRemove={this.onRemove}
                        onDragStart={this.onDragStart}
                    />,
                    this._controlBarRef
                );
            }

            renderToolbar (): void {
                if (!this.state._spectroIsBeingInspected) {
                    return;
                }

                const plugins: Array<Function> = [
                    ...PluginConstants.DEFAULT_PLUGINS,
                    ...spectro.plugins || []
                ];

                renderToolbar(this, plugins.map((plugin) => plugin(spectro, this)));
            }

            onParentFocus = (event: MouseEvent): void => {
                event.preventDefault();

                if (this.props.onParentFocus) {
                    this.props.onParentFocus();
                }
            };

            onInspect = (): void => {
                this.context.spectro.onInspect(this);
            };

            onDragStart = (): void => {
                const targetPath: ?NodeKey[] = getNodePath(
                    this.context.spectro.tree,
                    this.props.spectroKey
                );

                if (!targetPath) {
                    return;
                }

                this.setState({ _spectroIsBeingDragged: true });

                this.context.spectro.dragAndDrop = {
                    targetPath,
                    targetInstance: this,
                    targetRef: this._childrenRef,
                    dropIndex: -1,
                    depth: targetPath.length,
                    acceptableComponents: [],
                    lastDragOverNodeKey: null
                };

                // Bind global events
                document.documentElement.classList.add(StyleConstants.DRAG_IN_PROGRESS_CLASS);
                document.addEventListener('mouseup', this.onDrop);
            };

            onDragOver = (event: MouseEvent): void => {
                if (!this.context.spectro.dragAndDrop) {
                    return;
                }

                const { tree, dragAndDrop } = this.context.spectro;
                const {
                    targetPath,
                    targetInstance,
                    lastDragOverNodeKey,
                    lastDragOverRef } = dragAndDrop;
                const hasWhiteList: boolean = spectro.accepts && Array.isArray(spectro.accepts);
                const hasChildNodeKey: boolean = lastDragOverNodeKey !== null;
                const targetIsAllowedHere: boolean = (
                    hasWhiteList &&
                    spectro.accepts.some((type) => (
                        type._spectroEnhancer === targetInstance.constructor
                    ))
                );
                const isDragOverOnSelf: boolean = (
                    targetPath[targetPath.length - 1] === this.props.spectroKey
                );

                // Do nothing then self-drop
                if (isDragOverOnSelf) {
                    return;
                }

                // Once drag event reaches spectro component with
                // white-list prop `accepts`, keep that list for
                // next check "if element is allowed here"
                if (targetIsAllowedHere && hasChildNodeKey) {
                    event.stopPropagation();
                    const childNodePath: ?NodeKey[] = getNodePath(tree, lastDragOverNodeKey);
                    const dropPath: ?NodeKey[] = getNodePath(tree, this.props.spectroKey);
                    const acceptableComponents = spectro.accepts;
                    const { top, left, height, width } = getElementBox(lastDragOverRef);

                    // Prevent DND if target or dropzone are empty
                    if (!childNodePath || !dropPath) {
                        return;
                    }

                    let dropIndex: number = getNodeIndex(tree, childNodePath);
                    let willDropAfter: boolean = false;

                    // Negative drop index may happen on root component
                    if (dropIndex < 0) {
                        return;
                    }

                    // Increase drop index to move element after target
                    if (event.pageY > (top + (height / 2))) {
                        willDropAfter = true;
                        dropIndex += 1;
                    }

                    renderPlaceholder(left, top + (willDropAfter ? height : 0), width);

                    this.context.spectro.dragAndDrop = {
                        ...dragAndDrop,
                        dropPath,
                        dropIndex,
                        acceptableComponents
                    };

                    return;
                }

                this.context.spectro.dragAndDrop = {
                    ...this.context.spectro.dragAndDrop,
                    lastDragOverNodeKey: this.props.spectroKey,
                    lastDragOverRef: this._childrenRef
                };
            }

            onDragEnd = (): void => {
                // Clean up global events
                document.documentElement.classList.remove(StyleConstants.DRAG_IN_PROGRESS_CLASS);
                document.removeEventListener('mouseup', this.onDrop);

                // Reset DND state
                this.context.spectro.dragAndDrop = null;
                this.setState({ _spectroIsBeingDragged: false });

                if (this._childrenRef) {
                    this._childrenRef.focus();
                }
            };

            onDrop = (event: MouseEvent): void => {
                if (!this.context.spectro.dragAndDrop) {
                    return;
                }

                const { tree, dragAndDrop } = this.context.spectro;
                const { targetPath, targetInstance, dropPath, dropIndex } = dragAndDrop;

                dragAndDrop.depth -= 1;

                const isDropOnSelf: boolean = (
                    targetPath[targetPath.length - 1] === this.props.spectroKey
                );
                const hasWhiteList: boolean = dragAndDrop.acceptableComponents.length > 0;
                const hasAchievedRoot: boolean = dragAndDrop.depth <= 1;
                const isAllowedHere: boolean = dragAndDrop.acceptableComponents.some((type) => (
                    type._spectroEnhancer === targetInstance.constructor
                ));

                // Proceed drop
                if (isAllowedHere && hasWhiteList && !isDropOnSelf) {
                    const newTree = moveNodeAtPath(tree, targetPath, dropPath, dropIndex);
                    this.context.spectro.onChange(newTree);
                }

                // Stop event from bubbling up
                if (isAllowedHere || isDropOnSelf || hasAchievedRoot) {
                    event.stopPropagation();
                    targetInstance.onDragEnd();
                }

                this.setState({ _spectroHasPointerOver: false });
                destroyPlaceholder();
            };

            onRemove = (): void => {
                const { tree } = this.context.spectro;
                const { spectroKey } = this.props;
                const path: ?NodeKey[] = getNodePath(tree, spectroKey);

                if (!path) {
                    return;
                }

                const updatedTree: TreeNode = removeNodeAtPath(tree, path);

                this.context.spectro.onChange(updatedTree);
            };

            onPointerOver = (event: MouseEvent): void => {
                event.stopPropagation();

                // Prevent control bar to appear inside of focused component
                if (this.props.parentHasFocus) {
                    return;
                }

                this.setState({ _spectroHasPointerOver: true });
            };

            onPointerOut = (event: MouseEvent): void => {
                event.stopPropagation();
                this.setState({ _spectroHasPointerOver: false });
            };

            onFocus = (event: FocusEvent): void => {
                event.stopPropagation();
                this.setState({ _spectroHasFocus: true });

                if (this.props.onFocus) {
                    this.props.onFocus();
                }
            };

            onBlur = (event: FocusEvent): void => {
                event.stopPropagation();
                this.setState({ _spectroHasFocus: false });

                if (this.props.onBlur) {
                    this.props.onBlur();
                }
            };

            onInput = (event): void => {
                if (!this._childrenRef) {
                    return;
                }

                this._spectroSelection = saveSelection(this._childrenRef);

                const { tree } = this.context.spectro;
                const { spectroKey } = this.props;
                const diff: Object = { props: { children: event.target.innerText } };
                const node: TreeNode = getNode(tree, spectroKey);
                const path: ?NodeKey[] = getNodePath(tree, spectroKey);

                if (!path) {
                    return;
                }

                const updatedNode: TreeNode = mergeNodes(node, diff);
                const newTree: TreeNode = updateNodeAtPath(tree, path, updatedNode);

                this.context.spectro.onChange(newTree);
            };

            onPaste = (event: ClipboardEvent): void => {
                event.stopPropagation();
                event.preventDefault();

                convertPastedTextToPlainText(event);
            };

            onKeyPress = (event: KeyboardEvent): void => {
                // Prevent junk on Enter
                if (event.which === 13) {
                    event.preventDefault();
                }
            };

            _spectroFocus = (): void => {
                if (this._childrenRef) {
                    this._childrenRef.focus();
                }
            };

            _spectroKeepRef = (node: HTMLElement): void => {
                this._childrenRef = node;
            };

            render (): ReactElement<any> {
                const renderedElement: ReactElement<any> = super.render();

                if (this.context.spectro.enabled) {
                    const isDragAndDropActive: boolean = Boolean(this.context.spectro.dragAndDrop);
                    const isBeingDragged: boolean = this.state._spectroIsBeingDragged;
                    const hasFocus: boolean = this.state._spectroHasFocus;
                    const hasPointerOver: boolean = this.state._spectroHasPointerOver;
                    const hasChildren: boolean = spectro.void || (
                        this.props.children &&
                        this.props.children.length > 0
                    );
                    const addHoverStyles: boolean = !isDragAndDropActive && hasPointerOver;
                    const extendedProps = { ...renderedElement.props };

                    Object.assign(extendedProps, {
                        'aria-label': spectro.label,
                        'aria-grabbed': isBeingDragged,
                        tabIndex: extendedProps.tabIndex || 0,
                        style: extendedProps.style || {},
                        ref: (node: HTMLElement) => {
                            if (typeof renderedElement.ref === 'function') {
                                renderedElement.ref(node);
                            }

                            this._spectroKeepRef(node);
                        }
                    });

                    // Set additional styles
                    // $FlowFixMe: Allow to use &&
                    Object.assign(extendedProps.style, {
                        ...styles.active,
                        ...(addHoverStyles && styles.hover),
                        ...(hasFocus && styles.focus),
                        ...(isBeingDragged && styles.drag)
                    });

                    // Bind common events
                    Object.assign(extendedProps, {
                        onMouseOver: this.onPointerOver,
                        onMouseOut: this.onPointerOut,
                        onFocus: this.onFocus,
                        onBlur: this.onBlur,
                        onMouseMove: this.onDragOver,
                        onMouseUp: this.onDrop
                    });

                    // Bind `texteditable` events and attributes
                    if (spectro.textEditable) {
                        Object.assign(extendedProps, {
                            onInput: this.onInput,
                            onPaste: this.onPaste,
                            onKeyPress: this.onKeyPress,
                            contentEditable: true,
                            suppressContentEditableWarning: true,
                            spellCheck: spectro.spellCheck
                        });
                    }

                    // Mark void components
                    if (spectro.void) {
                        Object.assign(extendedProps, {
                            [StyleConstants.VOID_COMPONENT_ATTRIBUTE]: true
                        });
                    }

                    // Mark empty components
                    if (!hasChildren) {
                        Object.assign(extendedProps, {
                            [StyleConstants.EMPTY_COMPONENT_ATTRIBUTE]: true
                        });
                    }

                    return cloneElement(renderedElement, extendedProps);
                }

                return renderedElement;
            }
        };
    };
}
