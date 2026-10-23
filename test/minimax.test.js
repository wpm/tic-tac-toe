import { test } from "node:test";
import assert from "node:assert/strict";
import { bestMove } from "../src/minimax.js";

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
