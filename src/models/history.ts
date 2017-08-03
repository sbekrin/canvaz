export default class History<T = any> {
  history = [];
  current = 0;

  constructor(initial: T[] = []) {
    this.history = initial;
  }

  // Push new item to history
  push(item: T): void {
    this.rewind();
    this.history = [...this.history, item];
    this.current = this.history.length - 1;
  }

  // Reset current index
  rewind(): void {
    this.history = this.history.slice(0, this.current + 1);
    this.current = this.history.length - 1;
  }

  // Safely set current index
  setCurrent(index: number): number {
    const current = Math.min(this.history.length - 1, Math.max(0, index));
    this.current = current;
    return current;
  }

  // Returns current item
  getCurrent(): T {
    return this.history[this.current];
  }

  // Move forward in history
  forward(): boolean {
    const index = this.current + 1;
    return index === this.setCurrent(index);
  }

  // Move backward in history
  backward(): boolean {
    const index = this.current - 1;
    return index === this.setCurrent(index);
  }
}
