import getCurrentOrigin from '~/helpers/get-current-origin';

export default function isValidPostMessage(event) {
  return event.origin === getCurrentOrigin() && event.data.canvaz;
}
