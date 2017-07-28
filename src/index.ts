import CanvazProvider from '~/components/canvaz-provider';
import CanvazContainer from '~/components/canvaz-container';
import withCanvaz from '~/hocs/with-canvaz';
import TextEditable from '~/components/text-editable';

const PropEditable = props => props.children;

export {
  CanvazProvider,
  CanvazContainer,
  withCanvaz,
  TextEditable,
  PropEditable,
};
