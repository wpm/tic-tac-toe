import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';
import {
  type Board,
  type Move,
  type Player,
  createEmptyBoard,
  makeMove,
  isValidMove,
  getGameState,
  checkWinner,
  getBestMove,
} from '../game/engine';

export type GameStatus = 'playing' | 'won' | 'draw';

export interface GameSliceState {
  board: Board;
  gameStatus: GameStatus;
  winner: Player | null;
  currentPlayer: Player;
}

const initialState: GameSliceState = {
  board: createEmptyBoard(),
  gameStatus: 'playing',
  winner: null,
  currentPlayer: 'X',
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    makeHumanMove: (state, action: PayloadAction<Move>) => {
      // Validate move
      if (state.gameStatus !== 'playing') {
        return;
      }
      if (!isValidMove(state.board, action.payload)) {
        return;
      }

      // Apply move
      state.board = makeMove(state.board, action.payload, 'X');

      // Update game status
      const gameState = getGameState(state.board);
      if (gameState === 'X') {
        state.gameStatus = 'won';
        state.winner = 'X';
      } else if (gameState === 'draw') {
        state.gameStatus = 'draw';
      } else {
        // Game continues - switch to computer's turn
        state.currentPlayer = 'O';
      }
    },

    makeComputerMove: (state) => {
      // Computer can only move if it's their turn and game is in progress
      if (state.gameStatus !== 'playing' || state.currentPlayer !== 'O') {
        return;
      }

      // Get and apply best move
      const bestMove = getBestMove(state.board);
      state.board = makeMove(state.board, bestMove, 'O');

      // Update game status
      const gameState = getGameState(state.board);
      if (gameState === 'O') {
        state.gameStatus = 'won';
        state.winner = 'O';
      } else if (gameState === 'draw') {
        state.gameStatus = 'draw';
      } else {
        // Game continues - switch back to human's turn
        state.currentPlayer = 'X';
      }
    },

    resetGame: () => {
      return initialState;
    },
  },
});

export const { makeHumanMove, makeComputerMove, resetGame } = gameSlice.actions;

// Selectors
export const selectBoard = (state: RootState) => state.game.board;
export const selectGameStatus = (state: RootState) => state.game.gameStatus;
export const selectWinner = (state: RootState) => state.game.winner;
export const selectCurrentPlayer = (state: RootState) => state.game.currentPlayer;
export const selectCanMove = (state: RootState) => state.game.gameStatus === 'playing';

export default gameSlice.reducer;
