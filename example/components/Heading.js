/* @flow */
import { createElement } from 'react';
import withSpectro from '../../src';

type Props = {
    level: 2 | 3 | 4,
    children: string
};

const Heading = ({ children, level = 2 }: Props) => (
    createElement(`h${level}`, {}, children)
);

export default withSpectro({
    label: 'Heading',
    textEditable: true
})(Heading);
