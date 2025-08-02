import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login, { loginUser } from './Login';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock do react-router-dom para useNavigate
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => vi.fn(),
}));

const mockMutate = vi.fn();

vi.mock('@tanstack/react-query', () => ({
  useMutation: () => ({
    mutate: mockMutate,
    isPending: false,
  }),
}));

describe('Login', () => {
  beforeEach(() => {
    mockMutate.mockClear();
  });

  it('chama mutate com login e senha no submit', async () => {
    render(<Login />);

    fireEvent.change(screen.getByLabelText(/login/i), { target: { value: 'usuario' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'senha123' } });

    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({ login: 'usuario', senha: 'senha123' });
    });
  });
});

describe('loginUser', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('retorna token ao fazer login com sucesso', async () => {
    const fakeToken = { token: '123abc' };
    (fetch as unknown as vi.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => fakeToken,
    });

    const result = await loginUser({ login: 'user', senha: 'pass' });
    expect(result).toEqual(fakeToken);
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/validar-login',
      expect.objectContaining({
        method: 'POST',
      }),
    );
  });

  it('lança erro quando login falha', async () => {
    const errorMessage = 'Credenciais inválidas';
    (fetch as unknown as vi.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: errorMessage }),
    });

    await expect(loginUser({ login: 'user', senha: 'wrong' })).rejects.toThrow(errorMessage);
  });
});
