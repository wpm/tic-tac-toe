import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import App from '../App';

describe('App', () => {
  it('renders the game title', () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(screen.getByText(/Tic-Tac-Toe/i)).toBeTruthy();
  });

  it('renders game status', () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    // Should show whose turn it is
    expect(screen.getByText(/turn/i)).toBeTruthy();
  });
});
