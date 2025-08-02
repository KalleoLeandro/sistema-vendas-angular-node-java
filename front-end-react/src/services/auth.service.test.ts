import { login } from './auth-service';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('login', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('retorna token quando login é bem-sucedido', async () => {
    const fakeToken = 'token123';
    (fetch as unknown as vi.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: fakeToken }),
    });

    const token = await login('email@teste.com', 'senha123');

    expect(token).toBe(fakeToken);
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/validar-login',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'email@teste.com', senha: 'senha123' }),
      }),
    );
  });

  it('lança erro quando login falha', async () => {
    (fetch as unknown as vi.Mock).mockResolvedValueOnce({
      ok: false,
    });

    await expect(login('email@teste.com', 'senhaErrada')).rejects.toThrow('Login inválido');
  });
});
