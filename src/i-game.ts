export type IGameFieldCallback = (field: number[]) => void;

export interface IGame {
  readonly field: number[];
  readonly isCleared: boolean;
  reset(): void;
  slide(x: number, y: number): void;
  listenField(callback: IGameFieldCallback): void;
  unlistenField(callback: IGameFieldCallback): void;
}
