import compose from '~/helpers/compose';
import withStyles from '~/hocs/with-styles';
import withEnhance, { EnhanceProps } from '~/hocs/with-enhance';
import withData, { DataProps } from '~/hocs/with-data';

export default function withCanvaz<P = {}>(
  config: CanvazConfig
): (
  WrappedComponent: React.ComponentType<P & DataProps & EnhanceProps>
) => React.ComponentClass<P> {
  return WrappedComponent =>
    compose(withData, withEnhance(config), withStyles)(WrappedComponent);
}
