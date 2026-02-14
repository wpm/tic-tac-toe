import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Cell from '../Cell';

describe('Cell', () => {
  it('should render empty cell', () => {
    render(
      <Cell value={null} onClick={() => {}} disabled={false} isWinning={false} isPlayable={true} />
    );
    const cell = screen.getByRole('button');
    expect(cell).toBeInTheDocument();
    expect(cell).toHaveTextContent('');
  });

  it('should render X', () => {
    render(
      <Cell value="X" onClick={() => {}} disabled={false} isWinning={false} isPlayable={false} />
    );
    const cell = screen.getByRole('button');
    expect(cell).toHaveTextContent('X');
  });

  it('should render O', () => {
    render(
      <Cell value="O" onClick={() => {}} disabled={false} isWinning={false} isPlayable={false} />
    );
    const cell = screen.getByRole('button');
    expect(cell).toHaveTextContent('O');
  });

  it('should call onClick when clicked and not disabled', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <Cell
        value={null}
        onClick={handleClick}
        disabled={false}
        isWinning={false}
        isPlayable={true}
      />
    );

    const cell = screen.getByRole('button');
    await user.click(cell);

    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('should not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <Cell
        value={null}
        onClick={handleClick}
        disabled={true}
        isWinning={false}
        isPlayable={false}
      />
    );

    const cell = screen.getByRole('button');
    await user.click(cell);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should be disabled when disabled prop is true', () => {
    render(
      <Cell value={null} onClick={() => {}} disabled={true} isWinning={false} isPlayable={false} />
    );
    const cell = screen.getByRole('button');
    expect(cell).toBeDisabled();
  });

  it('should not be disabled when disabled prop is false', () => {
    render(
      <Cell value={null} onClick={() => {}} disabled={false} isWinning={false} isPlayable={true} />
    );
    const cell = screen.getByRole('button');
    expect(cell).not.toBeDisabled();
  });

  it('should apply winning class when isWinning is true', () => {
    render(
      <Cell value="X" onClick={() => {}} disabled={true} isWinning={true} isPlayable={false} />
    );
    const cell = screen.getByRole('button');
    expect(cell.className).toContain('winning');
  });

  it('should apply playable class when isPlayable is true', () => {
    render(
      <Cell value={null} onClick={() => {}} disabled={false} isWinning={false} isPlayable={true} />
    );
    const cell = screen.getByRole('button');
    expect(cell.className).toContain('playable');
  });

  it('should apply x class when value is X', () => {
    render(
      <Cell value="X" onClick={() => {}} disabled={false} isWinning={false} isPlayable={false} />
    );
    const cell = screen.getByRole('button');
    expect(cell.className).toContain('x');
  });

  it('should apply o class when value is O', () => {
    render(
      <Cell value="O" onClick={() => {}} disabled={false} isWinning={false} isPlayable={false} />
    );
    const cell = screen.getByRole('button');
    expect(cell.className).toContain('o');
  });
});
