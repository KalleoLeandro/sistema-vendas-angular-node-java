import {
  cadastrarUsuario,
  atualizarUsuario,
  buscarUsuarioPorId,
  validarCpf,
} from './cadastro-service';

import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('Serviços de usuário', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
    sessionStorage.setItem('token', 'token-mock');
  });

  afterEach(() => {
    vi.resetAllMocks();
    sessionStorage.clear();
  });

  it('cadastra usuário com sucesso', async () => {
    const usuario = { nome: 'João', email: 'joao@email.com', senha: '123' };
    const retorno = { id: '1', ...usuario };
    (fetch as unknown as vi.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => retorno,
    });

    const result = await cadastrarUsuario(usuario);

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/usuarios',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          Authorization: `Bearer token-mock`,
        }),
        body: JSON.stringify(usuario),
      }),
    );
    expect(result).toEqual(retorno);
  });

  it('atualiza usuário com sucesso', async () => {
    const id = '1';
    const usuario = { nome: 'Maria', email: 'maria@email.com', senha: '456' };
    const retorno = { id, ...usuario };
    (fetch as unknown as vi.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => retorno,
    });

    const result = await atualizarUsuario(id, usuario);

    expect(fetch).toHaveBeenCalledWith(
      `http://localhost:3000/api/usuarios/${id}`,
      expect.objectContaining({
        method: 'PUT',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          Authorization: `Bearer token-mock`,
        }),
        body: JSON.stringify(usuario),
      }),
    );
    expect(result).toEqual(retorno);
  });

  it('busca usuário por id', async () => {
    const id = '2';
    const retorno = { id, nome: 'Carlos' };
    (fetch as unknown as vi.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => retorno,
    });

    const result = await buscarUsuarioPorId(id);

    expect(fetch).toHaveBeenCalledWith(
      `http://localhost:3000/api/usuarios/${id}`,
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: `Bearer token-mock`,
        }),
      }),
    );
    expect(result).toEqual(retorno);
  });

  it('valida CPF', async () => {
    const cpf = '12345678900';
    const retorno = { valido: true };
    (fetch as unknown as vi.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => retorno,
    });

    const result = await validarCpf(cpf);

    expect(fetch).toHaveBeenCalledWith(
      `http://localhost:3000/api/cpf/validar?cpf=${cpf}`,
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: `Bearer token-mock`,
        }),
      }),
    );
    expect(result).toEqual(retorno);
  });

  it('lança erro ao cadastrar usuário com status não ok', async () => {
    (fetch as unknown as vi.Mock).mockResolvedValueOnce({
      ok: false,
    });

    await expect(cadastrarUsuario({ nome: 'A', email: 'a@a.com', senha: '123' })).rejects.toThrow();
  });

  it('lança erro ao atualizar usuário com status não ok', async () => {
    (fetch as unknown as vi.Mock).mockResolvedValueOnce({
      ok: false,
    });

    await expect(atualizarUsuario('1', { nome: 'A', email: 'a@a.com', senha: '123' })).rejects.toThrow();
  });
});
