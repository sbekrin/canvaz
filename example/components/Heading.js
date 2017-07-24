/* @flow */
import React, { createElement } from 'react';
import withSpectro, { SpectroSelectbox } from '../../src';

type Props = {
  level: 2 | 3 | 4,
  children: string,
};

const Heading = ({ children, level = 2 }: Props) =>
  createElement(`h${level}`, {}, children);

const options = {
  // $FlowFixMe
  2: '2nd',
  // $FlowFixMe
  3: '3td',
  // $FlowFixMe
  4: '4th',
};

export default withSpectro({
  label: 'Heading',
  textEditable: true,
  props: {
    level: <SpectroSelectbox label="Heading Level" options={options} />,
  },
})(Heading);
