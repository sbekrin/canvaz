/* @flow */
import { createElement } from 'react';
import withSpectro from '../../src';
import ListItem from './ListItem';

type Props = {
    children: Array<ListItem>,
    ordered: boolean
};

const List = ({ children, ordered = false }: Props) => (
    createElement(ordered ? 'ol' : 'ul', {}, children)
);

export default withSpectro({
    label: 'List',
    accepts: [ ListItem ]
})(List);
