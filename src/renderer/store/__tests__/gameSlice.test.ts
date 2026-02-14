import { describe, it, expect } from 'vitest';
import gameReducer, {
  makeHumanMove,
  makeComputerMove,
  resetGame,
  selectBoard,
  selectGameStatus,
  selectWinner,
  selectCurrentPlayer,
  selectCanMove,
} from '../gameSlice';
import type { GameSliceState } from '../gameSlice';
import { createEmptyBoard } from '../../game/engine';

describe('gameSlice', () => {
  describe('initial state', () => {
    it('should start with empty board', () => {
      const state = gameReducer(undefined, { type: 'unknown' });
      expect(state.board).toEqual(createEmptyBoard());
    });

    it('should start with playing status', () => {
      const state = gameReducer(undefined, { type: 'unknown' });
      expect(state.gameStatus).toBe('playing');
    });

    it('should start with no winner', () => {
      const state = gameReducer(undefined, { type: 'unknown' });
      expect(state.winner).toBe(null);
    });

    it('should start with X as current player', () => {
      const state = gameReducer(undefined, { type: 'unknown' });
      expect(state.currentPlayer).toBe('X');
    });
  });

  describe('makeHumanMove', () => {
    it('should place X at the specified position', () => {
      const initialState: GameSliceState = {
        board: createEmptyBoard(),
        gameStatus: 'playing',
        winner: null,
        currentPlayer: 'X',
      };

      const state = gameReducer(initialState, makeHumanMove({ row: 0, col: 0 }));
      expect(state.board[0][0]).toBe('X');
    });

    it('should switch current player to O after human move', () => {
      const initialState: GameSliceState = {
        board: createEmptyBoard(),
        gameStatus: 'playing',
        winner: null,
        currentPlayer: 'X',
      };

      const state = gameReducer(initialState, makeHumanMove({ row: 0, col: 0 }));
      expect(state.currentPlayer).toBe('O');
    });

    it('should not allow moves on occupied cells', () => {
      const board = createEmptyBoard();
      board[0][0] = 'X';
      const initialState: GameSliceState = {
        board,
        gameStatus: 'playing',
        winner: null,
        currentPlayer: 'X',
      };

      const state = gameReducer(initialState, makeHumanMove({ row: 0, col: 0 }));
      expect(state).toEqual(initialState);
    });

    it('should not allow moves when game is over', () => {
      const board = createEmptyBoard();
      board[0][0] = 'X';
      board[0][1] = 'X';
      board[0][2] = 'X';
      const initialState: GameSliceState = {
        board,
        gameStatus: 'won',
        winner: 'X',
        currentPlayer: 'X',
      };

      const state = gameReducer(initialState, makeHumanMove({ row: 1, col: 1 }));
      expect(state).toEqual(initialState);
    });

    it('should detect win after human move', () => {
      const board = createEmptyBoard();
      board[0][0] = 'X';
      board[0][1] = 'X';
      const initialState: GameSliceState = {
        board,
        gameStatus: 'playing',
        winner: null,
        currentPlayer: 'X',
      };

      const state = gameReducer(initialState, makeHumanMove({ row: 0, col: 2 }));
      expect(state.gameStatus).toBe('won');
      expect(state.winner).toBe('X');
    });

    it('should detect draw after human move', () => {
      const board = createEmptyBoard();
      board[0][0] = 'X';
      board[0][1] = 'O';
      board[0][2] = 'X';
      board[1][0] = 'X';
      board[1][1] = 'O';
      board[1][2] = 'O';
      board[2][0] = 'O';
      board[2][1] = 'X';
      // Only board[2][2] is empty
      const initialState: GameSliceState = {
        board,
        gameStatus: 'playing',
        winner: null,
        currentPlayer: 'X',
      };

      const state = gameReducer(initialState, makeHumanMove({ row: 2, col: 2 }));
      expect(state.gameStatus).toBe('draw');
      expect(state.winner).toBe(null);
    });
  });

  describe('makeComputerMove', () => {
    it('should place O on the board', () => {
      const board = createEmptyBoard();
      board[0][0] = 'X';
      const initialState: GameSliceState = {
        board,
        gameStatus: 'playing',
        winner: null,
        currentPlayer: 'O',
      };

      const state = gameReducer(initialState, makeComputerMove());
      // Count O's on the board
      const oCount = state.board.flat().filter((cell) => cell === 'O').length;
      expect(oCount).toBe(1);
    });

    it('should switch current player back to X after computer move', () => {
      const board = createEmptyBoard();
      board[0][0] = 'X';
      const initialState: GameSliceState = {
        board,
        gameStatus: 'playing',
        winner: null,
        currentPlayer: 'O',
      };

      const state = gameReducer(initialState, makeComputerMove());
      expect(state.currentPlayer).toBe('X');
    });

    it('should detect win after computer move', () => {
      const board = createEmptyBoard();
      board[0][0] = 'O';
      board[0][1] = 'O';
      board[1][0] = 'X';
      board[1][1] = 'X';
      const initialState: GameSliceState = {
        board,
        gameStatus: 'playing',
        winner: null,
        currentPlayer: 'O',
      };

      const state = gameReducer(initialState, makeComputerMove());
      expect(state.gameStatus).toBe('won');
      expect(state.winner).toBe('O');
      expect(state.board[0][2]).toBe('O');
    });

    it('should detect draw after computer move', () => {
      const board = createEmptyBoard();
      board[0][0] = 'X';
      board[0][1] = 'O';
      board[0][2] = 'X';
      board[1][0] = 'X';
      board[1][1] = 'O';
      board[1][2] = 'O';
      board[2][0] = 'O';
      board[2][1] = 'X';
      // Only board[2][2] is empty - computer will take it for a draw
      // Result: X O X / X O O / O X O - no winning lines
      const initialState: GameSliceState = {
        board,
        gameStatus: 'playing',
        winner: null,
        currentPlayer: 'O',
      };

      const state = gameReducer(initialState, makeComputerMove());
      expect(state.gameStatus).toBe('draw');
      expect(state.winner).toBe(null);
    });
  });

  describe('resetGame', () => {
    it('should reset to initial state', () => {
      const board = createEmptyBoard();
      board[0][0] = 'X';
      board[0][1] = 'O';
      const stateWithMoves: GameSliceState = {
        board,
        gameStatus: 'playing',
        winner: null,
        currentPlayer: 'X',
      };

      const state = gameReducer(stateWithMoves, resetGame());
      expect(state.board).toEqual(createEmptyBoard());
      expect(state.gameStatus).toBe('playing');
      expect(state.winner).toBe(null);
      expect(state.currentPlayer).toBe('X');
    });
  });

  describe('selectors', () => {
    const mockRootState = (gameState: GameSliceState) => ({
      game: gameState,
    });

    it('selectBoard should return board', () => {
      const board = createEmptyBoard();
      board[0][0] = 'X';
      const state = mockRootState({
        board,
        gameStatus: 'playing',
        winner: null,
        currentPlayer: 'O',
      });
      expect(selectBoard(state)).toEqual(board);
    });

    it('selectGameStatus should return game status', () => {
      const state = mockRootState({
        board: createEmptyBoard(),
        gameStatus: 'won',
        winner: 'X',
        currentPlayer: 'X',
      });
      expect(selectGameStatus(state)).toBe('won');
    });

    it('selectWinner should return winner', () => {
      const state = mockRootState({
        board: createEmptyBoard(),
        gameStatus: 'won',
        winner: 'O',
        currentPlayer: 'O',
      });
      expect(selectWinner(state)).toBe('O');
    });

    it('selectCurrentPlayer should return current player', () => {
      const state = mockRootState({
        board: createEmptyBoard(),
        gameStatus: 'playing',
        winner: null,
        currentPlayer: 'X',
      });
      expect(selectCurrentPlayer(state)).toBe('X');
    });

    it('selectCanMove should return true when game is playing', () => {
      const state = mockRootState({
        board: createEmptyBoard(),
        gameStatus: 'playing',
        winner: null,
        currentPlayer: 'X',
      });
      expect(selectCanMove(state)).toBe(true);
    });

    it('selectCanMove should return false when game is won', () => {
      const state = mockRootState({
        board: createEmptyBoard(),
        gameStatus: 'won',
        winner: 'X',
        currentPlayer: 'X',
      });
      expect(selectCanMove(state)).toBe(false);
    });

    it('selectCanMove should return false when game is draw', () => {
      const state = mockRootState({
        board: createEmptyBoard(),
        gameStatus: 'draw',
        winner: null,
        currentPlayer: 'X',
      });
      expect(selectCanMove(state)).toBe(false);
    });
  });
});
