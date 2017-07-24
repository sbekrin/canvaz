/* @flow */
import type { SpectroConfig } from '~/types/EditorTypes';
import EditorContainer from '~/components/EditorContainer';
import EditorSwitcher from '~/components/EditorSwitcher';
import EditorTextbox from '~/components/EditorToolbar/ToolbarTextbox';
import EditorSelectbox from '~/components/EditorToolbar/ToolbarSelectbox';
import createPropsPlugin from '~/plugins/PropsPlugin';
import createContentsPlugin from '~/plugins/ContentsPlugin';
import configDefaults from '~/constants/ConfigDefaults';
import createEnhancer from './enhancer';
import createWrapper from './wrapper';

export const SpectroEditor = EditorContainer;
export const SpectroSwitcher = EditorSwitcher;
export const SpectroTextbox = EditorTextbox;
export const SpectroSelectbox = EditorSelectbox;
export const plugins = {
  createPropsPlugin,
  createContentsPlugin,
};

export default function withSpectro(spectro: SpectroConfig): Function {
  return (component): ReactClass<any> => {
    const config = { ...configDefaults, ...spectro };
    const enhance = createEnhancer(config);
    const wrap = createWrapper(config);
    return wrap(enhance(component));
  };
}
