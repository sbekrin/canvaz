import getCurrentOrigin from '~/helpers/get-current-origin';

export default function broadcastMessage(type: string, data: {}) {
  window.postMessage({ ...data, type, canvaz: true }, getCurrentOrigin());
}
