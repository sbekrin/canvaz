export default function chain(...input: any[]): Function {
  const handlers = input.filter(item => typeof item === 'function');
  return event => handlers.forEach(handler => handler(event));
}
