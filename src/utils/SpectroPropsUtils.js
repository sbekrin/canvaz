/* @flow */
import invariant from 'invariant';
import type { SpectroProps } from 'types/EditorTypes';

export function validateSpectroProps (spectro: SpectroProps): void {
    // Check `label`
    const hasLabel = spectro.label;
    const labelIsString = hasLabel && typeof spectro.label === 'string';

    invariant(hasLabel, 'Make sure to specify `label` prop for Spectro Component');
    invariant(labelIsString, '`label` prop should be a string');

    // Check `accepts`
    const hasAcceptsProp = Boolean(spectro.accepts);

    if (hasAcceptsProp) {
        const acceptsPropIsArray = Array.isArray(spectro.accepts);
        const everyItemIsComponent = (
            acceptsPropIsArray &&
            spectro.accepts.every((c) => typeof c === 'function')
        );

        invariant(
            acceptsPropIsArray ||
            everyItemIsComponent,
            '`accepts` prop should be an array of components'
        );
    }
}
