/* @flow */
import type { Element as ReactElement } from 'react';
import { Component } from 'react';

/**
 * Check if component is stateless function
 */
export function isStateless (component: ReactClass<any>): boolean {
    return (
        !component.render &&
        !(component.prototype && component.prototype.render)
    );
}

/**
 * Returns display name of target component
 */
export function getDisplayName (component: ReactClass<any>): string {
    return (
        component.displayName ||
        component.name ||
        'Component'
    );
}

/**
 * Checks if element is enhanced with spectro
 */
export function isSpectroEnhanced (child: ReactElement<any>): boolean {
    return (
        child.type &&
        child.type._spectroEnhancer &&
        child.type._spectroEnhancer._isSpectroEnhanced
    );
}

/**
 * Converts (possibly) statelss function to class component
 */
export function convertToClassComponent (component: Function | ReactClass<any>): ReactClass<any> {
    if (isStateless(component)) {
        return class extends Component<any, any, any> {
            static displayName = getDisplayName(component);

            render (): ReactElement<any> {
                return component(this.props, this.context);
            }
        };
    }

    return component;
}
