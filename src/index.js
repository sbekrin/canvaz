/* @flow */
import type { SpectroConfig } from 'types/EditorTypes';
import EditorContainer from 'components/EditorContainer';
import EditorSwitcher from 'components/EditorSwitcher';
import defaults from 'constants/ConfigDefaults';
import createEnhancer from './enhancer';
import createWrapper from './wrapper';

export const SpectroEditor = EditorContainer;
export const SpectroSwitcher = EditorSwitcher;

export default function withSpectro (spectro: SpectroConfig): Function {
    return (component): ReactClass<any> => {
        const config = { ...defaults, ...spectro };
        const enhance = createEnhancer(config);
        const wrap = createWrapper(config);
        return wrap(enhance(component));
    };
}
