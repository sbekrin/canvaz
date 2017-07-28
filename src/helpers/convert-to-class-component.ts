import * as React from 'react';
import getDisplayName from '~/helpers/get-display-name';
import isStateless from '~/helpers/is-stateless-component';

export default function convertToClassComponent<P = {}, S = {}>(
  component: React.ComponentType<P>
): React.ComponentClass<P> {
  if (isStateless(component)) {
    return class extends React.Component<P, S> {
      static displayName = getDisplayName(component);

      render() {
        return (component as React.StatelessComponent<P>)(
          this.props,
          this.context
        );
      }
    };
  }

  return component as React.ComponentClass<P>;
}
