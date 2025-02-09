export class Listener<T> {
  protected callbacks = new Set<(value: T) => void>();

  listen(callback: (value: T) => void): void {
    this.callbacks.add(callback);
  }

  unlisten(callback: (value: T) => void): void {
    this.callbacks.delete(callback);
  }

  protected emit(value: T): void {
    this.callbacks.forEach((c) => c(value));
  }
}

export type IGameFieldChangeCallback = (field: number[]) => void;

export interface IGame {
  readonly field: number[];
  readonly isCleared: boolean;
  reset(): void;
  slide(x: number, y: number): void;
  listen(callback: IGameFieldChangeCallback): void;
  unlisten(callback: IGameFieldChangeCallback): void;
}

export class Game extends Listener<number[]> implements IGame {
  private _field: number[] = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0,
  ];

  constructor() {
    super();
    this.reset();
  }

  reset(): void {
    for (let i = 0; i < 30; i++) {
      const r = Math.floor(Math.random() * this._field.length);
      this.slide(r % 4, Math.floor(r / 4));
    }
  }

  get isCleared(): boolean {
    for (let i = 0; i < this._field.length - 1; i++) {
      if (this._field[i] !== i + 1) {
        return false;
      }
    }
    return true;
  }

  get field(): number[] {
    return this._field;
  }

  private getValue(x: number, y: number): number {
    const i = 4 * y + x;
    if (x < 0 || x > 4 || y < 0 || y > 4) {
      return -1;
    }
    return this._field[i];
  }

  slide(x: number, y: number): void {
    if (this.getValue(x, y) <= 0) {
      // 存在しない箇所だったら何もしない
      return;
    }

    const p = 4 * y + x;
    for (let i = 1; i <= 3; i++) {
      if (this.getValue(x, y - i) === 0) {
        // console.log("上", i);
        for (let j = i; j > 0; j--) {
          this._field[p - 4 * j] = this._field[p - 4 * (j - 1)];
        }
        this._field[p] = 0;
        this.emit(this._field);
        return;
      } else if (this.getValue(x, y + i) === 0) {
        // console.log("下", i);
        for (let j = i; j > 0; j--) {
          this._field[p + 4 * j] = this._field[p + 4 * (j - 1)];
        }
        this._field[p] = 0;
        this.emit(this._field);
        return;
      } else if (this.getValue(x - i, y) === 0) {
        // console.log("左", i);
        for (let j = i; j > 0; j--) {
          this._field[p - j] = this._field[p - (j - 1)];
        }
        this._field[p] = 0;
        this.emit(this._field);
        return;
      } else if (this.getValue(x + i, y) === 0) {
        // console.log("右", i);
        for (let j = i; j > 0; j--) {
          this._field[p + j] = this._field[p + (j - 1)];
        }
        this._field[p] = 0;
        this.emit(this._field);
        return;
      }
    }
  }
}
