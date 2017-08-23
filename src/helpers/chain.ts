export default function chain(...input: any[]): Function {
  const handlers = input.filter(item => typeof item === 'function');
  return (event: React.SyntheticEvent<any>) =>
    handlers.forEach(handler => {
      if (!event.isPropagationStopped()) {
        handler(event);
      }
    });
}
