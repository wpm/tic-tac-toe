import { test } from "node:test";
import assert from "node:assert/strict";
import { newGame, humanMove } from "../src/game.js";
import { emptyBoard } from "../src/board.js";
import { boardOf } from "./helpers.js";

function count(board, mark) {
  return board.filter((cell) => cell === mark).length;
}

test("newGame starts with an empty board and status playing", () => {
  assert.deepEqual(newGame(), { board: emptyBoard(), status: "playing" });
});

test("a legal human move adds one X and the computer's O", () => {
  const state = newGame();
  const next = humanMove(state, 0);
  assert.equal(next.board[0], "X");
  assert.equal(count(next.board, "X"), 1);
  assert.equal(count(next.board, "O"), 1);
  assert.equal(next.status, "playing");
  assert.deepEqual(state, newGame(), "the original state is not mutated");
});

test("a move to an occupied cell returns the same state", () => {
  const state = { board: boardOf("....X...O"), status: "playing" };
  assert.equal(humanMove(state, 4), state);
  assert.equal(humanMove(state, 8), state);
});

test("a move out of range returns the same state", () => {
  const state = newGame();
  assert.equal(humanMove(state, -1), state);
  assert.equal(humanMove(state, 9), state);
  assert.equal(humanMove(state, 1.5), state);
});

test("a move after the game is over returns the same state", () => {
  const state = { board: boardOf("XXXOO...."), status: "human-wins" };
  assert.equal(humanMove(state, 5), state);
});

test("a human winning move ends the game with no computer reply", () => {
  const state = { board: boardOf("XX.OO...."), status: "playing" };
  const next = humanMove(state, 2);
  assert.deepEqual(next, { board: boardOf("XXXOO...."), status: "human-wins" });
});

test("a computer reply that wins ends the game", () => {
  // O threatens 2; X plays 8 instead of blocking.
  const state = { board: boardOf("OO.X..X.."), status: "playing" };
  const next = humanMove(state, 8);
  assert.deepEqual(next, { board: boardOf("OOOX..X.X"), status: "computer-wins" });
});

test("a final move that fills the board with no winner is a draw", () => {
  const state = { board: boardOf("XOXXOOOX."), status: "playing" };
  const next = humanMove(state, 8);
  assert.deepEqual(next, { board: boardOf("XOXXOOOXX"), status: "draw" });
});
