import * as React from 'react';

export default function dehydrate(
  component: React.ReactElement<any>
): CanvazNode {
  if (!React.isValidElement(component)) {
    if (process.env.NODE_ENV === 'development') {
      throw new TypeError('Invalid React element provided to `dehydrate`');
    }
  }

  const type =
    (component.type as React.ComponentClass<any>).displayName ||
    (component.type as React.StatelessComponent<any>).name ||
    (component.type as string) ||
    'Component';
  const props = { ...component.props };
  const children = Boolean(component.props.children)
    ? React.Children.toArray(component.props.children).map(dehydrate)
    : [];
  return { type, props, children };
}
