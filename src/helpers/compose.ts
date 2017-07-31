export default function compose(...functions: Function[]) {
  if (functions.length === 0) {
    return argument => argument;
  }

  if (functions.length === 1) {
    return functions[0];
  }

  return functions.reduce((a, b) => (...args) => a(b(...args)));
}
