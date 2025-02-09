import { createContext, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Game } from "./game.ts";
import { IGame } from "./i-game.ts";
import "./main.css";

const game = new Game();
export const GameContext = createContext<IGame>(game);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GameContext.Provider value={game}>
      <App />
    </GameContext.Provider>
  </StrictMode>
);
