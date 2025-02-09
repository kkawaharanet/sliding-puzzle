import { useContext, useEffect, useState } from "react";
import styles from "./App.module.css";
import { IGameFieldCallback } from "./i-game";
import { GameContext } from "./main";

function App() {
  const game = useContext(GameContext);
  const [field, setField] = useState(game.field);
  const [isCleared, setIsCleared] = useState(false);

  useEffect(() => {
    const callback: IGameFieldCallback = (field) => {
      // インスタンスが同じだと更新されないため、別インスタンスにする
      setField([...field]);
      setIsCleared(game.isCleared);
    };
    game.listenField(callback);
    return () => {
      game.unlistenField(callback);
    };
  }, []);

  function handleSlideClick(x: number, y: number) {
    if (isCleared) {
      return;
    }
    game.slide(x, y);
  }

  return (
    <div>
      <div className={styles["game-container"]}>
        {isCleared && (
          <div className={styles["cleared-container"]}>
            <p className={styles["well-done"]}>
              <strong>Well done.</strong>
            </p>
            <button
              onClick={() => game.reset()}
              className={styles["button-restart"]}
            >
              もう一度あそぶ
            </button>
          </div>
        )}
        <div className={styles["grid-container"]}>
          {field.map((f, i) => {
            if (f <= 0) {
              return <div key={f}></div>;
            }
            return (
              <div
                className={styles.item}
                key={f}
                onClick={() => handleSlideClick(i % 4, Math.floor(i / 4))}
              >
                {f}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
