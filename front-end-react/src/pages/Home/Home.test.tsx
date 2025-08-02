import { render, screen } from '@testing-library/react';
import Home from './Home';
import { describe, expect, it } from 'vitest';

describe('Home', () => {
  it('deve exibir a mensagem de boas-vindas', () => {
    render(<Home />);
    expect(screen.getByText(/Bem-vindo à Home!/i)).toBeInTheDocument();
  });
});
