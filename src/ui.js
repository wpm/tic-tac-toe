import { newGame, humanMove } from "./game.js";

const MESSAGES = {
  playing: "Your move",
  "human-wins": "You win",
  "computer-wins": "Computer wins",
  draw: "Draw",
};

// Renders the game into `root`, rebuilding its contents after every event.
export function mount(root) {
  const doc = root.ownerDocument;
  let state = newGame();

  function element(tag, className, text) {
    const el = doc.createElement(tag);
    if (className) el.className = className;
    if (text) el.textContent = text;
    return el;
  }

  function render() {
    const board = element("div", "board");
    state.board.forEach((mark, index) => {
      const cell = element("button", null, mark);
      cell.dataset.index = String(index);
      cell.disabled = mark !== null || state.status !== "playing";
      cell.addEventListener("click", () => {
        state = humanMove(state, index);
        render();
      });
      board.append(cell);
    });

    const reset = element("button", "new-game", "New game");
    reset.addEventListener("click", () => {
      state = newGame();
      render();
    });

    root.replaceChildren(board, element("p", "status", MESSAGES[state.status]), reset);
  }

  render();
}
