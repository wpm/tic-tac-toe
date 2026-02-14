import { useSelector } from 'react-redux';
import { RootState } from './store/store';

function App() {
  // Demonstrate Redux store access
  const storeState = useSelector((state: RootState) => state);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <h1>Electron + Vite + React + TypeScript</h1>
      <p>Redux Toolkit is connected and ready to use!</p>
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p>Store state: {JSON.stringify(storeState)}</p>
      </div>
    </div>
  );
}

export default App;
