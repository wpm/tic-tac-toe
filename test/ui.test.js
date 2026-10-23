import { test } from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { mount } from "../src/ui.js";
import { newGame, humanMove } from "../src/game.js";

function mounted() {
  const { window } = new JSDOM("<div id='game'></div>");
  const root = window.document.getElementById("game");
  mount(root);
  return root;
}

function cells(root) {
  return [...root.querySelectorAll(".board button")];
}

function status(root) {
  return root.querySelector(".status").textContent;
}

function click(root, selector) {
  root.querySelector(selector).click();
}

function assertInitial(root) {
  const buttons = cells(root);
  assert.equal(buttons.length, 9);
  buttons.forEach((button, i) => {
    assert.equal(button.dataset.index, String(i));
    assert.equal(button.textContent, "");
    assert.equal(button.disabled, false);
  });
  assert.equal(status(root), "Your move");
  assert.equal(root.querySelector("button.new-game").textContent, "New game");
}

test("initial render has 9 empty enabled cells and status Your move", () => {
  assertInitial(mounted());
});

test("clicking a cell shows X there, O elsewhere, and disables the cell", () => {
  const root = mounted();
  click(root, '[data-index="4"]');
  const marks = cells(root).map((button) => button.textContent);
  assert.equal(marks[4], "X");
  assert.equal(marks.filter((m) => m === "O").length, 1);
  assert.equal(marks.filter((m) => m === "X").length, 1);
  assert.equal(root.querySelector('[data-index="4"]').disabled, true);
  assert.equal(status(root), "Your move");
});

test("clicking an occupied cell changes nothing", () => {
  const root = mounted();
  click(root, '[data-index="0"]');
  const before = root.innerHTML;
  const o = cells(root).find((button) => button.textContent === "O");
  // Disabled buttons ignore click(), so dispatch the event directly.
  o.dispatchEvent(new root.ownerDocument.defaultView.MouseEvent("click", { bubbles: true }));
  click(root, '[data-index="0"]');
  assert.equal(root.innerHTML, before);
});

test("New game returns to the initial render", () => {
  const root = mounted();
  click(root, '[data-index="0"]');
  click(root, "button.new-game");
  assertInitial(root);
});

test("a game played to the end shows its status and disables all cells", () => {
  const root = mounted();
  let state = newGame();
  // Always take the lowest-index empty cell until the game ends.
  while (state.status === "playing") {
    const index = state.board.indexOf(null);
    state = humanMove(state, index);
    click(root, `[data-index="${index}"]`);
  }
  const expected = { "human-wins": "You win", "computer-wins": "Computer wins", draw: "Draw" };
  assert.equal(status(root), expected[state.status]);
  assert.deepEqual(
    cells(root).map((button) => button.textContent || null),
    state.board,
  );
  assert.ok(cells(root).every((button) => button.disabled));
});
