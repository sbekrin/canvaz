export default function isStatelessComponent(
  component: React.ComponentType<any>
) {
  return !(component.prototype && component.prototype.render);
}
