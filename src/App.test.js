import { render, screen } from '@testing-library/react';
import App from './App';

test('renders calculator header', () => {
  render(<App />);
  const headerElement = screen.getByText(/CALCULADORA SPRA/i);
  expect(headerElement).toBeInTheDocument();
});