import { place, legalMoves, winner, isGameOver } from "./board.js";

function opponentOf(mark) {
  return mark === "X" ? "O" : "X";
}

// Scores a finished board from the point of view of `mark`.
function scoreTerminal(board, mark) {
  const won = winner(board);
  if (won === mark) return 1;
  if (won === null) return 0;
  return -1;
}

// The value of `board` for `mark`, with `toMove` about to play.
// `mark` maximizes its own score; the opponent minimizes it.
function minimax(board, mark, toMove) {
  if (isGameOver(board)) return scoreTerminal(board, mark);
  const scores = legalMoves(board).map((index) =>
    minimax(place(board, index, toMove), mark, opponentOf(toMove)),
  );
  return toMove === mark ? Math.max(...scores) : Math.min(...scores);
}

// The index of the best cell for `mark` to play on `board`.
// Ties go to the lowest index.
export function bestMove(board, mark) {
  if (isGameOver(board)) {
    throw new Error("the game is already over");
  }
  let best = null;
  let bestScore = -Infinity;
  for (const index of legalMoves(board)) {
    const score = minimax(place(board, index, mark), mark, opponentOf(mark));
    if (score > bestScore) {
      best = index;
      bestScore = score;
    }
  }
  return best;
}
