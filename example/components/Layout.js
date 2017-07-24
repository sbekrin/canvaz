import React from 'react';
import withSpectro from '../../src';
import LayoutColumn from './LayoutColumn';
import './Layout.css';

type Props = {
  children: ?Array<LayoutColumn>,
};

const Layout = ({ children }: Props) =>
  <div className="Layout">
    {children}
  </div>;

export default withSpectro({
  label: 'Layout',
  accepts: [LayoutColumn],
})(Layout);
