import type { Cell as CellValue } from '../game/engine';

interface CellProps {
  value: CellValue;
  onClick: () => void;
  disabled: boolean;
}

function Cell({ value, onClick, disabled }: CellProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100px',
        height: '100px',
        fontSize: '48px',
        fontWeight: 'bold',
        border: '2px solid #333',
        backgroundColor: disabled ? '#f0f0f0' : '#fff',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {value || ''}
    </button>
  );
}

export default Cell;
