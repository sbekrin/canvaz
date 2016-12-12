/* @flow */
import React, { createElement } from 'react';
import withSpectro, { SpectroSelectbox } from '../../src';
import ListItem from './ListItem';

type OrderType = 'ordered' | 'unordered';

type Props = {
    children: Array<ListItem>,
    type: OrderType
};

const List = ({ children, type = 'unordered' }: Props) => (
    createElement(type === 'ordered' ? 'ol' : 'ul', {}, children)
);

const orderOptions = {
    unordered: 'Unordered',
    ordered: 'Ordered'
};

export default withSpectro({
    label: 'List',
    accepts: [ ListItem ],
    props: {
        type: <SpectroSelectbox label="Type" options={orderOptions} />
    }
})(List);
