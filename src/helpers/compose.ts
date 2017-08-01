export default function compose(...input: any[]): Function {
  const functions = input.filter(item => typeof item === 'function');

  if (functions.length === 0) {
    return argument => argument;
  }

  if (functions.length === 1) {
    return functions[0];
  }

  return functions.reduce((a, b) => (...args) => a(b(...args)));
}
