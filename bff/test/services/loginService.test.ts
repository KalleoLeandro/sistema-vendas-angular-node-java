import * as loginService from '@services/loginService';
import { CustomError } from '@errors/customError';
import { LoginRequest } from '@models/loginRequest';

global.fetch = jest.fn();
const mockedFetch = fetch as jest.Mock;

jest.mock('@utils/utils', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn()
  }
}));

jest.mock('@environments/environments', () => ({
  environments: {
    BACK_END: 'http://fakeapi.com'
  }
}));

describe('loginService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validarLogin', () => {
    const loginRequest: LoginRequest = {
      login: 'user',
      senha: 'pass'
    };

    it('retorna token e dados com status 200', async () => {
      mockedFetch.mockResolvedValue({
        json: () => Promise.resolve({
          status: 200,
          token: 'abc',
          expiration: '2025-01-01',
          userName: 'user'
        })
      });

      const result = await loginService.validarLogin(loginRequest);

      expect(result).toEqual({
        status: 200,
        token: 'abc',
        expiration: '2025-01-01',
        userName: 'user'
      });
    });

    it('retorna status 401 com mensagem de erro', async () => {
      mockedFetch.mockResolvedValue({
        json: () => Promise.resolve({
          status: 401,
          message: 'Credenciais inválidas'
        })
      });

      const result = await loginService.validarLogin(loginRequest);

      expect(result).toEqual({
        status: 401,
        message: 'Credenciais inválidas'
      });
    });

    it('retorna status 500 para outros erros da API', async () => {
      mockedFetch.mockResolvedValue({
        json: () => Promise.resolve({
          status: 500,
          message: 'Erro inesperado'
        })
      });

      const result = await loginService.validarLogin(loginRequest);

      expect(result).toEqual({
        status: 500,
        message: 'Erro inesperado'
      });
    });

    it('lança CustomError se houver erro na requisição', async () => {
      mockedFetch.mockRejectedValue(new Error('Falha na rede'));

      await expect(loginService.validarLogin(loginRequest)).rejects.toThrow(CustomError);
      await expect(loginService.validarLogin(loginRequest)).rejects.toThrow('Falha na rede');
    });
  });

  describe('validarToken', () => {
    it('retorna true se o token for válido', async () => {
      mockedFetch.mockResolvedValue({
        json: () => Promise.resolve(true)
      });

      const result = await loginService.validarToken('token123');
      expect(result).toBe(true);
    });

    it('retorna false se o token for inválido', async () => {
      mockedFetch.mockResolvedValue({
        json: () => Promise.resolve(false)
      });

      const result = await loginService.validarToken('token_invalido');
      expect(result).toBe(false);
    });

    it('lança CustomError se houver erro ao validar token', async () => {
      mockedFetch.mockRejectedValue(new Error('Erro ao validar'));

      await expect(loginService.validarToken('token')).rejects.toThrow(CustomError);
      await expect(loginService.validarToken('token')).rejects.toThrow('Erro ao validar');
    });
  });
});
