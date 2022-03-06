import { TileState } from "./components/Tile";
import { attempts, wordLength } from "./utils/constants";


export interface ContextType {
    hardMode: boolean,
    darkTheme: boolean,
    gameState: object | null,
}

export enum GameStatus {
  In_progress = "IN_PROGRESS",
  Win = "WIN",
  Fail = "FAIL",
}

export const initialState:ContextType = {
    hardMode: false,
    darkTheme: false,
    gameState: {
      boardState: new Array(attempts).fill(new Array(wordLength).fill('')),
      evaluations: new Array(attempts).fill(new Array(wordLength).fill(TileState.Empty)),
      gameStatus: GameStatus.In_progress,
      solution: '',
      rowIndex: 0
    },
};
  
export const reducer = (state: any, action: any) => {
    switch (action.type) {
      case "UPDATE_GAME_STATE":
        return {
          ...state,
          gameState: {...state.gameState, ...action.payload},
        };
      case "WIN":
        return {
          ...state,
          gameState: {...state.gameState, gameStatus: GameStatus.Win},
        };
      case "FAIL":
        return {
          ...state,
          gameState: {...state.gameState, gameStatus: GameStatus.Fail},
        };
      case "SET_HARD_MODE":
        return {
          ...state,
          hardMode: action.payload
        };
      case "SET_DARK_THEME":
        return {
          ...state,
          darkTheme: action.payload
        };
      case "RESET":
        return {
          ...state,
          gameState: {
            boardState: new Array(attempts).fill(new Array(wordLength).fill('')),
            evaluations: new Array(attempts).fill(new Array(wordLength).fill(TileState.Empty)),
            gameStatus: GameStatus.In_progress,
            solution: '',
            rowIndex: 0
          }
        };
  
      default:
        return state;
    }
  };