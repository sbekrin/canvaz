/* @flow */
import type { SpectroConfig } from 'types/EditorTypes';

export default function createContentsPlugin (config: SpectroConfig) {
    if (!config.accepts || config.accepts.length === 0) {
        return;
    }

    return;
}
