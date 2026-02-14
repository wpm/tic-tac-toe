import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Cell from '../Cell';

describe('Cell', () => {
  it('should render empty cell', () => {
    render(<Cell value={null} onClick={() => {}} disabled={false} />);
    const cell = screen.getByRole('button');
    expect(cell).toBeInTheDocument();
    expect(cell).toHaveTextContent('');
  });

  it('should render X', () => {
    render(<Cell value="X" onClick={() => {}} disabled={false} />);
    const cell = screen.getByRole('button');
    expect(cell).toHaveTextContent('X');
  });

  it('should render O', () => {
    render(<Cell value="O" onClick={() => {}} disabled={false} />);
    const cell = screen.getByRole('button');
    expect(cell).toHaveTextContent('O');
  });

  it('should call onClick when clicked and not disabled', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Cell value={null} onClick={handleClick} disabled={false} />);

    const cell = screen.getByRole('button');
    await user.click(cell);

    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('should not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Cell value={null} onClick={handleClick} disabled={true} />);

    const cell = screen.getByRole('button');
    await user.click(cell);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Cell value={null} onClick={() => {}} disabled={true} />);
    const cell = screen.getByRole('button');
    expect(cell).toBeDisabled();
  });

  it('should not be disabled when disabled prop is false', () => {
    render(<Cell value={null} onClick={() => {}} disabled={false} />);
    const cell = screen.getByRole('button');
    expect(cell).not.toBeDisabled();
  });
});
