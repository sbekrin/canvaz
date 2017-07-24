/* @flow */
import React from 'react';
import withSpectro from '../../src';

type Props = {
  children: ?string,
};

const ListItem = ({ children }: Props) =>
  <li>
    {children}
  </li>;

export default withSpectro({
  label: 'List Item',
  textEditable: true,
})(ListItem);
