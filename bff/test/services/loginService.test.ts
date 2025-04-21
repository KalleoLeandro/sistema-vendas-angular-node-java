import * as loginService from '@services/loginService';
import { CustomError } from '@errors/customError';
import { LoginRequest } from '@models/loginRequest';
import { LoginCadastroDados } from '@models/cadastroLogin';

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
        ok: true,
        status: 200,
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
        ok: false,
        status: 401,
        json: () => Promise.resolve({
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
        ok: false,
        status: 500,
        json: () => Promise.resolve({
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

  describe('cadastrarLogin', () => {
    const cadastroLogin: LoginCadastroDados = {
      login: 'user',
      senha: 'pass',
      nome: '',
      cpf: '',
      perfil: ''
    };
    const token = 'valid-token';

    it('retorna mensagem de sucesso com status 201', async () => {
      mockedFetch.mockResolvedValue({
        status: 201,
        json: () => Promise.resolve({
          status: 201,
          message: 'Cadastro efetuado com sucesso'
        })
      });

      const result = await loginService.cadastrarLogin(cadastroLogin, token);

      expect(result).toEqual({
        status: 201,
        message: 'Cadastro efetuado com sucesso'
      });
    });

    it('retorna mensagem de erro com status diferente de 201', async () => {
      mockedFetch.mockResolvedValue({
        status: 400,
        json: () => Promise.resolve({
          status: 400,
          message: 'Erro ao cadastrar o login'
        })
      });

      const result = await loginService.cadastrarLogin(cadastroLogin, token);

      expect(result).toEqual({
        status: 400,
        message: 'Erro ao cadastrar o login'
      });
    });

    it('lança CustomError em caso de erro na requisição', async () => {
      mockedFetch.mockRejectedValue(new Error('Falha na rede'));

      await expect(loginService.cadastrarLogin(cadastroLogin, token)).rejects.toThrow(CustomError);
      await expect(loginService.cadastrarLogin(cadastroLogin, token)).rejects.toThrow('Falha na rede');
    });
  });
});
