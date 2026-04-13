import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders home page', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /talent tracker/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /add candidate/i })).toBeInTheDocument();
});
