/**
 * Tic-Tac-Toe Game Engine
 *
 * Pure TypeScript functions implementing the game logic including minimax AI.
 * All functions are pure (no side effects) and can be used independently.
 */

// Type Definitions
export type Cell = 'X' | 'O' | null;
export type Board = [[Cell, Cell, Cell], [Cell, Cell, Cell], [Cell, Cell, Cell]];
export type Player = 'X' | 'O';
export type GameState = Player | 'draw' | 'in-progress';
export type Move = {
  row: number;
  col: number;
};

/**
 * Creates an empty 3x3 game board with all cells set to null.
 */
export function createEmptyBoard(): Board {
  return [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];
}

/**
 * Applies a move to the board, returning a new board without mutating the original.
 */
export function makeMove(board: Board, position: Move, player: Player): Board {
  const newBoard = board.map((row) => [...row]) as Board;
  newBoard[position.row][position.col] = player;
  return newBoard;
}

/**
 * Checks if a move is valid (within bounds and cell is empty).
 */
export function isValidMove(board: Board, position: Move): boolean {
  const { row, col } = position;
  if (row < 0 || row > 2 || col < 0 || col > 2) {
    return false;
  }
  return board[row][col] === null;
}

/**
 * Checks if there's a winner and returns the winning player, or null if none.
 */
export function checkWinner(board: Board): Player | null {
  // Check rows
  for (let row = 0; row < 3; row++) {
    if (
      board[row][0] !== null &&
      board[row][0] === board[row][1] &&
      board[row][1] === board[row][2]
    ) {
      return board[row][0] as Player;
    }
  }

  // Check columns
  for (let col = 0; col < 3; col++) {
    if (
      board[0][col] !== null &&
      board[0][col] === board[1][col] &&
      board[1][col] === board[2][col]
    ) {
      return board[0][col] as Player;
    }
  }

  // Check diagonals
  if (board[0][0] !== null && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
    return board[0][0] as Player;
  }

  if (board[0][2] !== null && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
    return board[0][2] as Player;
  }

  return null;
}

/**
 * Checks if the game is a draw (board is full with no winner).
 */
export function isDraw(board: Board): boolean {
  if (checkWinner(board) !== null) {
    return false;
  }
  return board.every((row) => row.every((cell) => cell !== null));
}

/**
 * Returns the current game state.
 */
export function getGameState(board: Board): GameState {
  const winner = checkWinner(board);
  if (winner !== null) {
    return winner;
  }
  if (isDraw(board)) {
    return 'draw';
  }
  return 'in-progress';
}

/**
 * Gets all available moves (empty cells) on the board.
 */
function getAvailableMoves(board: Board): Move[] {
  const moves: Move[] = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (board[row][col] === null) {
        moves.push({ row, col });
      }
    }
  }
  return moves;
}

/**
 * Evaluates the board position from the computer's (O) perspective.
 * Returns:
 *  10 if O wins
 * -10 if X wins
 *   0 if draw or in-progress
 */
function evaluateBoard(board: Board): number {
  const winner = checkWinner(board);
  if (winner === 'O') return 10;
  if (winner === 'X') return -10;
  return 0;
}

/**
 * Minimax algorithm implementation for optimal play.
 * Computer is O (maximizing player), human is X (minimizing player).
 */
function minimax(board: Board, depth: number, isMaximizing: boolean): number {
  const score = evaluateBoard(board);

  // Terminal states - adjust score by depth to prefer faster wins and slower losses
  if (score === 10) {
    return score - depth;
  }
  if (score === -10) {
    return score + depth;
  }

  if (isDraw(board)) {
    return 0;
  }

  const availableMoves = getAvailableMoves(board);

  if (isMaximizing) {
    // Computer's turn (O)
    let maxScore = -Infinity;
    for (const move of availableMoves) {
      const newBoard = makeMove(board, move, 'O');
      const moveScore = minimax(newBoard, depth + 1, false);
      maxScore = Math.max(maxScore, moveScore);
    }
    return maxScore;
  } else {
    // Human's turn (X)
    let minScore = Infinity;
    for (const move of availableMoves) {
      const newBoard = makeMove(board, move, 'X');
      const moveScore = minimax(newBoard, depth + 1, true);
      minScore = Math.min(minScore, moveScore);
    }
    return minScore;
  }
}

/**
 * Gets the best move for the computer player (O) using minimax algorithm.
 */
export function getBestMove(board: Board): Move {
  let bestScore = -Infinity;
  let bestMove: Move | null = null;

  const availableMoves = getAvailableMoves(board);

  for (const move of availableMoves) {
    const newBoard = makeMove(board, move, 'O');
    const score = minimax(newBoard, 0, false);

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  if (bestMove === null) {
    throw new Error('No valid moves available');
  }

  return bestMove;
}
