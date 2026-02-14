import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch } from './store/store';
import {
  selectBoard,
  selectGameStatus,
  selectWinner,
  selectCurrentPlayer,
  selectCanMove,
  makeHumanMove,
  makeComputerMove,
  resetGame,
} from './store/gameSlice';
import Cell from './components/Cell';
import type { Move } from './game/engine';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const board = useSelector(selectBoard);
  const gameStatus = useSelector(selectGameStatus);
  const winner = useSelector(selectWinner);
  const currentPlayer = useSelector(selectCurrentPlayer);
  const canMove = useSelector(selectCanMove);

  // Automatically trigger computer move when it's the computer's turn
  useEffect(() => {
    if (gameStatus === 'playing' && currentPlayer === 'O') {
      // Small delay to make the computer move feel more natural
      const timer = setTimeout(() => {
        dispatch(makeComputerMove());
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [gameStatus, currentPlayer, dispatch]);

  const handleCellClick = (row: number, col: number) => {
    if (!canMove || currentPlayer !== 'X') {
      return;
    }

    const move: Move = { row, col };
    dispatch(makeHumanMove(move));
  };

  const handleReset = () => {
    dispatch(resetGame());
  };

  const getStatusMessage = () => {
    if (gameStatus === 'won') {
      return `${winner} wins!`;
    }
    if (gameStatus === 'draw') {
      return "It's a draw!";
    }
    return `${currentPlayer}'s turn`;
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        gap: '20px',
      }}
    >
      <h1>Tic-Tac-Toe</h1>

      {/* Status Display */}
      <div
        style={{
          fontSize: '24px',
          fontWeight: 'bold',
          minHeight: '40px',
        }}
      >
        {getStatusMessage()}
      </div>

      {/* Game Board */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 100px)',
          gridTemplateRows: 'repeat(3, 100px)',
          gap: '0',
        }}
      >
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              value={cell}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              disabled={!canMove || cell !== null || currentPlayer !== 'X'}
            />
          ))
        )}
      </div>

      {/* Play Again Button */}
      {gameStatus !== 'playing' && (
        <button
          onClick={handleReset}
          style={{
            padding: '12px 24px',
            fontSize: '18px',
            fontWeight: 'bold',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Play Again
        </button>
      )}
    </div>
  );
}

export default App;
