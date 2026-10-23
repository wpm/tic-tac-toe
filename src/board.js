// The 8 winning lines: 3 rows, 3 columns, 2 diagonals.
const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function emptyBoard() {
  return Array(9).fill(null);
}

export function place(board, index, mark) {
  if (!Number.isInteger(index) || index < 0 || index > 8) {
    throw new RangeError(`index ${index} is out of range`);
  }
  if (board[index] !== null) {
    throw new Error(`cell ${index} is already occupied`);
  }
  const next = board.slice();
  next[index] = mark;
  return next;
}

export function legalMoves(board) {
  return board.flatMap((cell, index) => (cell === null ? [index] : []));
}

export function winner(board) {
  for (const [a, b, c] of LINES) {
    if (board[a] !== null && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

export function isFull(board) {
  return !board.includes(null);
}

export function isGameOver(board) {
  return winner(board) !== null || isFull(board);
}
