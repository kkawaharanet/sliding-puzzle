import { IGame, IGameFieldCallback } from "./i-game";
import { Listener } from "./listener";

export class Game implements IGame {
  private static readonly SIZE = 4;
  private fieldListener = new Listener<number[]>();

  private _field: number[] = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0,
  ];

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

  constructor() {
    this.reset();
  }

  reset(): void {
    for (let i = 0; i < 100; i++) {
      const r = Math.floor(Math.random() * this._field.length);
      this.slide(r % Game.SIZE, Math.floor(r / Game.SIZE));
    }
  }

  private getValue(x: number, y: number): number {
    const i = Game.SIZE * y + x;
    if (x < 0 || x >= Game.SIZE || y < 0 || y >= Game.SIZE) {
      return -1;
    }
    if (i < 0 || i >= this._field.length) {
      return -1;
    }
    return this._field[i];
  }

  slide(x: number, y: number): void {
    if (this.getValue(x, y) <= 0) {
      // 存在しない箇所だったら何もしない
      return;
    }

    const p = Game.SIZE * y + x;
    for (let i = 1; i <= Game.SIZE - 1; i++) {
      if (this.getValue(x, y - i) === 0) {
        // console.log("上", i);
        for (let j = i; j > 0; j--) {
          this._field[p - Game.SIZE * j] = this._field[p - Game.SIZE * (j - 1)];
        }
        this._field[p] = 0;
        this.fieldListener.emit(this._field);
        return;
      } else if (this.getValue(x, y + i) === 0) {
        // console.log("下", i);
        for (let j = i; j > 0; j--) {
          this._field[p + Game.SIZE * j] = this._field[p + Game.SIZE * (j - 1)];
        }
        this._field[p] = 0;
        this.fieldListener.emit(this._field);
        return;
      } else if (this.getValue(x - i, y) === 0) {
        // console.log("左", i);
        for (let j = i; j > 0; j--) {
          this._field[p - j] = this._field[p - (j - 1)];
        }
        this._field[p] = 0;
        this.fieldListener.emit(this._field);
        return;
      } else if (this.getValue(x + i, y) === 0) {
        // console.log("右", i);
        for (let j = i; j > 0; j--) {
          this._field[p + j] = this._field[p + (j - 1)];
        }
        this._field[p] = 0;
        this.fieldListener.emit(this._field);
        return;
      }
    }
  }

  listenField(callback: IGameFieldCallback): void {
    this.fieldListener.listen(callback);
  }

  unlistenField(callback: IGameFieldCallback): void {
    this.fieldListener.unlisten(callback);
  }
}
