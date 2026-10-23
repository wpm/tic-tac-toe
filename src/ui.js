import { newGame, humanMove, canMove } from "./game.js";

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

  function setState(next) {
    state = next;
    render();
  }

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
      cell.disabled = !canMove(state, index);
      cell.addEventListener("click", () => setState(humanMove(state, index)));
      board.append(cell);
    });

    const reset = element("button", "new-game", "New game");
    reset.addEventListener("click", () => setState(newGame()));

    root.replaceChildren(board, element("p", "status", MESSAGES[state.status]), reset);
  }

  render();
}
