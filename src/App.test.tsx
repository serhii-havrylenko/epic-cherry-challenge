import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Add variable button', () => {
  render(<App />);
  const addVariableElement = screen.getByRole('button', { name: /add variable/i });
  expect(addVariableElement).toBeInTheDocument();
});

test('renders select operation component', () => {
  render(<App />);
  const finalResultElement = screen.getByRole('combobox');
  expect(finalResultElement).toBeInTheDocument();
});

test('renders the final result', () => {
  render(<App />);
  const finalResultElement = screen.getByText(/final result/i);
  expect(finalResultElement).toBeInTheDocument();
});
