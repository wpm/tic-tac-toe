import { test } from "node:test";
import assert from "node:assert/strict";
import { bestMove } from "../src/minimax.js";

// Builds a board from 9 characters: X, O, or . for an empty cell.
function boardOf(cells) {
  return [...cells].map((c) => (c === "." ? null : c));
}

test("bestMove takes a winning move when one is available", () => {
  assert.equal(bestMove(boardOf("OO.XX...."), "O"), 2);
});
