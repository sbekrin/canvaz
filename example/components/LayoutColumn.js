/* @flow */
import React from 'react';
import withSpectro from '../../src';
import Heading from './Heading';
import Paragraph from './Paragraph';
import List from './List';
import './LayoutColumn.css';

type Props = {
  children: ?Array<Paragraph | Heading>,
};

const LayoutColumn = ({ children }: Props) =>
  <div className="LayoutColumn">
    {children}
  </div>;

export default withSpectro({
  label: 'Column',
  accepts: [Heading, Paragraph, List],
})(LayoutColumn);
