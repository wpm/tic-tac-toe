import { test } from "node:test";
import assert from "node:assert/strict";
import { bestMove } from "../src/minimax.js";
import { emptyBoard, place, legalMoves, winner, isGameOver } from "../src/board.js";

// Builds a board from 9 characters: X, O, or . for an empty cell.
function boardOf(cells) {
  return [...cells].map((c) => (c === "." ? null : c));
}

test("bestMove takes a winning move when one is available", () => {
  assert.equal(bestMove(boardOf("O.OX.X.X."), "O"), 1);
});

test("bestMove blocks the opponent's immediate win when it has none of its own", () => {
  // X threatens 8 (column 2-5-8); 8 is the highest legal index, so this
  // is not the tie-break picking the lowest index.
  assert.equal(bestMove(boardOf("..X.OX..."), "O"), 8);
});

test("bestMove prefers winning now over blocking", () => {
  // O wins at 2; X threatens 5.
  assert.equal(bestMove(boardOf("OO.XX...."), "O"), 2);
});

test("bestMove throws on a won board", () => {
  assert.throws(() => bestMove(boardOf("XXXOO...."), "O"));
});

test("bestMove throws on a full drawn board", () => {
  assert.throws(() => bestMove(boardOf("XOXXOOOXX"), "X"));
});

test("O playing bestMove never loses against any sequence of X moves", () => {
  let gamesPlayed = 0;
  // X plays every legal move in turn; O always answers with bestMove.
  function playOut(board) {
    for (const index of legalMoves(board)) {
      let next = place(board, index, "X");
      if (!isGameOver(next)) {
        next = place(next, bestMove(next, "O"), "O");
      }
      if (isGameOver(next)) {
        assert.notEqual(winner(next), "X", `X won: ${next.map((c) => c ?? ".").join("")}`);
        gamesPlayed++;
      } else {
        playOut(next);
      }
    }
  }
  playOut(emptyBoard());
  assert.ok(gamesPlayed > 0);
});
