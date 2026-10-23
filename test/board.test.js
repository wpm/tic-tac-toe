import { test } from "node:test";
import assert from "node:assert/strict";
import { emptyBoard, place } from "../src/board.js";

test("emptyBoard has 9 null cells", () => {
  assert.deepEqual(emptyBoard(), Array(9).fill(null));
});

test("place puts a mark at an index without mutating the original", () => {
  const board = emptyBoard();
  const next = place(board, 4, "X");
  assert.equal(next[4], "X");
  assert.deepEqual(board, emptyBoard());
});

test("place throws on an occupied cell", () => {
  const board = place(emptyBoard(), 0, "X");
  assert.throws(() => place(board, 0, "O"));
});

test("place throws on an out-of-range index", () => {
  assert.throws(() => place(emptyBoard(), 9, "X"));
  assert.throws(() => place(emptyBoard(), -1, "X"));
});
