import { emptyBoard, place, legalMoves, winner, isFull, isGameOver } from "./board.js";
import { bestMove } from "./minimax.js";

// The human is always X and moves first; the computer is always O.
function statusOf(board) {
  const won = winner(board);
  if (won === "X") return "human-wins";
  if (won === "O") return "computer-wins";
  if (isFull(board)) return "draw";
  return "playing";
}

export function newGame() {
  return { board: emptyBoard(), status: "playing" };
}

// Whether the human may play at `index`: the game is on and the cell is empty.
export function canMove(state, index) {
  return state.status === "playing" && legalMoves(state.board).includes(index);
}

// Plays X at `index` and the computer's reply. An illegal move, or a move
// after the game is over, returns `state` itself.
export function humanMove(state, index) {
  if (!canMove(state, index)) return state;
  let board = place(state.board, index, "X");
  if (!isGameOver(board)) {
    board = place(board, bestMove(board, "O"), "O");
  }
  return { board, status: statusOf(board) };
}
