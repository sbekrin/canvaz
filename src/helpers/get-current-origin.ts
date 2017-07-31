export default function getCurrentOrigin() {
  return `${document.location.protocol}//${document.location.host}`;
}
