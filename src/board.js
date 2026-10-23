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
