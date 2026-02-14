import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from '../App';

describe('App', () => {
  it('renders the app with Redux store connected', () => {
    const store = configureStore({
      reducer: {},
    });

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(screen.getByText(/Electron \+ Vite \+ React \+ TypeScript/i)).toBeTruthy();
    expect(screen.getByText(/Redux Toolkit is connected and ready to use!/i)).toBeTruthy();
  });

  it('can access Redux store state', () => {
    const store = configureStore({
      reducer: {},
    });

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    // Verify the store state is displayed (even if empty)
    expect(screen.getByText(/Store state:/i)).toBeTruthy();
  });
});
