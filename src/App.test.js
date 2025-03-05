import { render, screen } from '@testing-library/react';
import App from './App';

test('renders calculator header', () => {
  render(<App />);
  const headerElement = screen.getByText(/CALCULADORA SPRA/i);
  expect(headerElement).toBeInTheDocument();
});

test('renders calculator mode buttons', () => {
  render(<App />);
  const basicModeButton = screen.getByText(/SPRA Básico/i);
  const plusModeButton = screen.getByText(/SPRA\+/i);
  expect(basicModeButton).toBeInTheDocument();
  expect(plusModeButton).toBeInTheDocument();
});