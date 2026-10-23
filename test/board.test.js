import { test } from "node:test";
import assert from "node:assert/strict";
import { emptyBoard, place, legalMoves, winner } from "../src/board.js";

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

test("legalMoves lists every cell on an empty board", () => {
  assert.deepEqual(legalMoves(emptyBoard()), [0, 1, 2, 3, 4, 5, 6, 7, 8]);
});

test("legalMoves lists only empty cells, ascending", () => {
  const board = place(place(place(emptyBoard(), 0, "X"), 4, "O"), 8, "X");
  assert.deepEqual(legalMoves(board), [1, 2, 3, 5, 6, 7]);
});

// Builds a board from 9 characters: X, O, or . for an empty cell.
function boardOf(cells) {
  return [...cells].map((c) => (c === "." ? null : c));
}

test("winner is null on an empty board", () => {
  assert.equal(winner(emptyBoard()), null);
});

test("winner finds a row", () => {
  assert.equal(winner(boardOf("XXXOO....")), "X");
});

test("winner finds a column", () => {
  assert.equal(winner(boardOf("OX.OX.O..")), "O");
});

test("winner finds the main diagonal", () => {
  assert.equal(winner(boardOf("XO..XO..X")), "X");
});

test("winner finds the anti-diagonal", () => {
  assert.equal(winner(boardOf("X.OXO.O..")), "O");
});

test("winner is null on a full drawn board", () => {
  assert.equal(winner(boardOf("XOXXOOOXX")), null);
});
