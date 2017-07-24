/* @flow */
import React from 'react';
import withSpectro from '../../src';

type Props = {
  lead: boolean,
  children: string,
};

const Paragraph = ({ lead = false, children }: Props) =>
  <p className={lead ? 'lead' : null}>
    {children}
  </p>;

export default withSpectro({
  label: 'Paragraph',
  textEditable: true,
})(Paragraph);
