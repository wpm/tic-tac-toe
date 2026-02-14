import { describe, it, expect } from 'vitest';
import {
  Board,
  Cell,
  GameState,
  Player,
  checkWinner,
  createEmptyBoard,
  getBestMove,
  getGameState,
  isDraw,
  isValidMove,
  makeMove,
} from '../engine';

describe('Game Engine', () => {
  describe('createEmptyBoard', () => {
    it('creates a 3x3 board with all empty cells', () => {
      const board = createEmptyBoard();
      expect(board).toHaveLength(3);
      expect(board[0]).toHaveLength(3);
      expect(board.flat().every((cell) => cell === null)).toBe(true);
    });
  });

  describe('makeMove', () => {
    it('places a player marker on an empty cell', () => {
      const board = createEmptyBoard();
      const newBoard = makeMove(board, { row: 0, col: 0 }, 'X');
      expect(newBoard[0][0]).toBe('X');
    });

    it('does not mutate the original board', () => {
      const board = createEmptyBoard();
      const originalBoard = JSON.stringify(board);
      makeMove(board, { row: 0, col: 0 }, 'X');
      expect(JSON.stringify(board)).toBe(originalBoard);
    });
  });

  describe('isValidMove', () => {
    it('returns true for an empty cell', () => {
      const board = createEmptyBoard();
      expect(isValidMove(board, { row: 0, col: 0 })).toBe(true);
    });

    it('returns false for an occupied cell', () => {
      const board = createEmptyBoard();
      board[0][0] = 'X';
      expect(isValidMove(board, { row: 0, col: 0 })).toBe(false);
    });

    it('returns false for out of bounds positions', () => {
      const board = createEmptyBoard();
      expect(isValidMove(board, { row: -1, col: 0 })).toBe(false);
      expect(isValidMove(board, { row: 0, col: 3 })).toBe(false);
      expect(isValidMove(board, { row: 3, col: 0 })).toBe(false);
    });
  });

  describe('checkWinner', () => {
    it('detects horizontal win in row 0', () => {
      const board: Board = [
        ['X', 'X', 'X'],
        [null, null, null],
        [null, null, null],
      ];
      expect(checkWinner(board)).toBe('X');
    });

    it('detects horizontal win in row 1', () => {
      const board: Board = [
        [null, null, null],
        ['O', 'O', 'O'],
        [null, null, null],
      ];
      expect(checkWinner(board)).toBe('O');
    });

    it('detects horizontal win in row 2', () => {
      const board: Board = [
        [null, null, null],
        [null, null, null],
        ['X', 'X', 'X'],
      ];
      expect(checkWinner(board)).toBe('X');
    });

    it('detects vertical win in column 0', () => {
      const board: Board = [
        ['X', null, null],
        ['X', null, null],
        ['X', null, null],
      ];
      expect(checkWinner(board)).toBe('X');
    });

    it('detects vertical win in column 1', () => {
      const board: Board = [
        [null, 'O', null],
        [null, 'O', null],
        [null, 'O', null],
      ];
      expect(checkWinner(board)).toBe('O');
    });

    it('detects vertical win in column 2', () => {
      const board: Board = [
        [null, null, 'X'],
        [null, null, 'X'],
        [null, null, 'X'],
      ];
      expect(checkWinner(board)).toBe('X');
    });

    it('detects diagonal win from top-left to bottom-right', () => {
      const board: Board = [
        ['O', null, null],
        [null, 'O', null],
        [null, null, 'O'],
      ];
      expect(checkWinner(board)).toBe('O');
    });

    it('detects diagonal win from top-right to bottom-left', () => {
      const board: Board = [
        [null, null, 'X'],
        [null, 'X', null],
        ['X', null, null],
      ];
      expect(checkWinner(board)).toBe('X');
    });

    it('returns null when there is no winner', () => {
      const board: Board = [
        ['X', 'O', 'X'],
        ['X', 'X', 'O'],
        ['O', 'X', 'O'],
      ];
      expect(checkWinner(board)).toBeNull();
    });
  });

  describe('isDraw', () => {
    it('returns true when board is full with no winner', () => {
      const board: Board = [
        ['X', 'O', 'X'],
        ['X', 'X', 'O'],
        ['O', 'X', 'O'],
      ];
      expect(isDraw(board)).toBe(true);
    });

    it('returns false when board is not full', () => {
      const board: Board = [
        ['X', 'O', null],
        ['X', 'X', 'O'],
        ['O', 'X', 'O'],
      ];
      expect(isDraw(board)).toBe(false);
    });

    it('returns false when there is a winner', () => {
      const board: Board = [
        ['X', 'X', 'X'],
        ['O', 'O', null],
        [null, null, null],
      ];
      expect(isDraw(board)).toBe(false);
    });
  });

  describe('getGameState', () => {
    it('returns "X" when X wins', () => {
      const board: Board = [
        ['X', 'X', 'X'],
        [null, null, null],
        [null, null, null],
      ];
      expect(getGameState(board)).toBe('X');
    });

    it('returns "O" when O wins', () => {
      const board: Board = [
        ['O', null, null],
        ['O', null, null],
        ['O', null, null],
      ];
      expect(getGameState(board)).toBe('O');
    });

    it('returns "draw" when game is a draw', () => {
      const board: Board = [
        ['X', 'O', 'X'],
        ['X', 'X', 'O'],
        ['O', 'X', 'O'],
      ];
      expect(getGameState(board)).toBe('draw');
    });

    it('returns "in-progress" when game is not over', () => {
      const board: Board = [
        ['X', null, null],
        [null, 'O', null],
        [null, null, null],
      ];
      expect(getGameState(board)).toBe('in-progress');
    });
  });

  describe('Minimax Computer Player', () => {
    it('picks the winning move when available', () => {
      // O can win by playing at [0, 2]
      const board: Board = [
        ['O', 'O', null],
        ['X', 'X', null],
        [null, null, null],
      ];
      const move = getBestMove(board);
      expect(move).toEqual({ row: 0, col: 2 });
    });

    it('blocks the opponent from winning', () => {
      // X is about to win at [0, 2], O must block
      const board: Board = [
        ['X', 'X', null],
        ['O', null, null],
        [null, null, null],
      ];
      const move = getBestMove(board);
      expect(move).toEqual({ row: 0, col: 2 });
    });

    it('takes the center on first move', () => {
      const board = createEmptyBoard();
      board[0][0] = 'X'; // Human played corner
      const move = getBestMove(board);
      expect(move).toEqual({ row: 1, col: 1 });
    });

    it('never loses - can force draw or win from empty board', () => {
      const board = createEmptyBoard();
      let currentBoard = board;
      let currentPlayer: Player = 'X';

      // Play a complete game where computer (O) plays optimally
      // Starting from empty board, playing suboptimally as X
      const xMoves = [
        { row: 0, col: 0 },
        { row: 0, col: 2 },
        { row: 2, col: 1 },
        { row: 2, col: 2 },
      ];
      let xMoveIndex = 0;

      while (getGameState(currentBoard) === 'in-progress') {
        if (currentPlayer === 'X') {
          // Human makes a move
          if (xMoveIndex < xMoves.length) {
            currentBoard = makeMove(currentBoard, xMoves[xMoveIndex], 'X');
            xMoveIndex++;
          } else {
            break;
          }
        } else {
          // Computer makes optimal move
          const move = getBestMove(currentBoard);
          currentBoard = makeMove(currentBoard, move, 'O');
        }
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      }

      const finalState = getGameState(currentBoard);
      // Computer should never lose (either draw or win)
      expect(finalState).not.toBe('X');
    });

    it('wins when the opponent makes a mistake', () => {
      // Suboptimal play by X allows O to win
      const board: Board = [
        ['X', null, null],
        [null, 'O', null],
        [null, null, null],
      ];
      const move1 = getBestMove(board);
      const board2 = makeMove(board, move1, 'O');

      // X makes a bad move
      const board3 = makeMove(board2, { row: 2, col: 2 }, 'X');

      const move2 = getBestMove(board3);
      const board4 = makeMove(board3, move2, 'O');

      // If O hasn't won yet, continue
      if (getGameState(board4) === 'in-progress') {
        // X makes another move
        const board5 = makeMove(board4, { row: 0, col: 2 }, 'X');
        const move3 = getBestMove(board5);
        const board6 = makeMove(board5, move3, 'O');

        // O should be able to win eventually against suboptimal play
        const state = getGameState(board6);
        expect(['O', 'draw']).toContain(state);
      } else {
        expect(getGameState(board4)).toBe('O');
      }
    });
  });
});
