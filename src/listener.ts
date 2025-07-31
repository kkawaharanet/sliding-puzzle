export class Listener<T> {
  private callbacks = new Set<(value: T) => void>();

  listen(callback: (value: T) => void): void {
    this.callbacks.add(callback);
  }

  unlisten(callback: (value: T) => void): void {
    this.callbacks.delete(callback);
  }

  emit(value: T): void {
    this.callbacks.forEach((c) => c(value));
  }
}
