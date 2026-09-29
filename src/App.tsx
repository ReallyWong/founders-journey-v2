import { useState, type Dispatch, type SetStateAction } from "react";
import type { GameState, Gender } from "@/game/types";
import { newGame, type NewGameOptions } from "@/game/engine";
import { loadGame, clearSave } from "@/game/save";
import CharacterCreation from "@/components/CharacterCreation";
import GameScreen from "@/components/GameScreen";
import EndingScreen from "@/components/EndingScreen";

export default function App() {
  const [state, setState] = useState<GameState | null>(() => loadGame());
  const setGameState = setState as Dispatch<SetStateAction<GameState>>;

  const start = (name: string, gender: Gender, regionId: string, industryId: string, opts: NewGameOptions) => {
    clearSave();
    setState(newGame(name, gender, regionId, industryId, opts));
  };

  const restart = () => {
    setState(null);
  };

  if (!state)
    return (
      <CharacterCreation
        onStart={start}
        onContinue={() => {
          const s = loadGame();
          if (s) setState(s);
        }}
      />
    );
  if (!state.alive && state.ending) return <EndingScreen state={state} onRestart={restart} />;
  return <GameScreen state={state} setState={setGameState} />;
}
