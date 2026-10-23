// Builds a board from 9 characters: X, O, or . for an empty cell.
export function boardOf(cells) {
  return [...cells].map((c) => (c === "." ? null : c));
}
