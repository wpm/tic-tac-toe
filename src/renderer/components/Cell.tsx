import type { Cell as CellValue } from '../game/engine';
import styles from './Cell.module.css';

interface CellProps {
  value: CellValue;
  onClick: () => void;
  disabled: boolean;
  isWinning: boolean;
  isPlayable: boolean;
}

function Cell({ value, onClick, disabled, isWinning, isPlayable }: CellProps) {
  const classNames = [styles.cell];

  if (value === 'X') {
    classNames.push(styles.x);
  } else if (value === 'O') {
    classNames.push(styles.o);
  }

  if (isWinning) {
    classNames.push(styles.winning);
  }

  if (isPlayable && !disabled) {
    classNames.push(styles.playable);
  }

  return (
    <button onClick={onClick} disabled={disabled} className={classNames.join(' ')}>
      {value || ''}
    </button>
  );
}

export default Cell;
