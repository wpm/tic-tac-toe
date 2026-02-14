import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch } from './store/store';
import {
  selectBoard,
  selectGameStatus,
  selectWinner,
  selectCurrentPlayer,
  selectCanMove,
  selectWinningLine,
  makeHumanMove,
  makeComputerMove,
  resetGame,
} from './store/gameSlice';
import Cell from './components/Cell';
import type { Move } from './game/engine';
import styles from './App.module.css';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const board = useSelector(selectBoard);
  const gameStatus = useSelector(selectGameStatus);
  const winner = useSelector(selectWinner);
  const currentPlayer = useSelector(selectCurrentPlayer);
  const canMove = useSelector(selectCanMove);
  const winningLine = useSelector(selectWinningLine);

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

  const isCellWinning = (row: number, col: number): boolean => {
    if (!winningLine) return false;
    return winningLine.some((pos) => pos.row === row && pos.col === col);
  };

  const isCellPlayable = (row: number, col: number): boolean => {
    return canMove && board[row][col] === null && currentPlayer === 'X';
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Tic-Tac-Toe</h1>

      <div className={styles.status}>{getStatusMessage()}</div>

      <div className={styles.board}>
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              value={cell}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              disabled={!canMove || cell !== null || currentPlayer !== 'X'}
              isWinning={isCellWinning(rowIndex, colIndex)}
              isPlayable={isCellPlayable(rowIndex, colIndex)}
            />
          ))
        )}
      </div>

      {gameStatus !== 'playing' && (
        <button onClick={handleReset} className={styles.playagainbutton}>
          Play Again
        </button>
      )}
    </div>
  );
}

export default App;
