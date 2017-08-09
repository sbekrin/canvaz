export default function canDropUnder(
  accept: React.ComponentType[],
  target: CanvazNode
) {
  const whitelist = accept.map(
    (component: any) => component.canvazConfig.label
  );
  return whitelist.indexOf(target.type) > -1;
}
