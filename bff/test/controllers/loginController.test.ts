import { Request, Response } from 'express';
import * as loginService from '@services/loginService';
import { CustomError } from '@errors/customError';
import { decriptografia } from '@utils/utils';
import { cadastrarLogin, validarLogin, validarToken } from '@controllers/loginController';
import { LoginCadastroDados } from '@models/cadastroLogin';

// Mocks
jest.mock('@services/loginService');
jest.mock('@utils/utils', () => ({
  decriptografia: jest.fn(),
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

describe('loginController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('validarLogin', () => {
    it('deve retornar status 200 com um token quando a validação for bem-sucedida', async () => {
      req = {
        body: { hash: 'valid-hash' },
      };

      const mockDecrypted = '{"username":"admin","password":"password"}';
      const mockReturn = {
        status: 200,
        token: 'valid-token',
        expiration: '2025-12-31',
        message: 'Login successful',
      };

      (decriptografia as jest.Mock).mockReturnValue(mockDecrypted);
      (loginService.validarLogin as jest.Mock).mockResolvedValue(mockReturn);

      await validarLogin(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockReturn);
    });

    it('deve retornar erro 500 quando o hash estiver ausente', async () => {
      req = { body: {} };

      await validarLogin(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith('Erro ao validar o login');
    });

    it('deve retornar erro 500 quando não for possível descriptografar o hash', async () => {
      req = { body: { hash: 'invalid-hash' } };

      (decriptografia as jest.Mock).mockReturnValue(null);

      await validarLogin(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith('Erro ao validar o login');
    });

    it('deve retornar status 400 quando o retorno do loginService for inválido', async () => {
      req = { body: { hash: 'valid-hash' } };

      const mockDecrypted = '{"username":"admin","password":"password"}';
      const mockReturn = {
        status: 400,
        message: 'Invalid credentials',
      };

      (decriptografia as jest.Mock).mockReturnValue(mockDecrypted);
      (loginService.validarLogin as jest.Mock).mockResolvedValue(mockReturn);

      await validarLogin(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });
  });

  describe('validarToken', () => {
    it('deve retornar status 200 com verdadeiro quando o token for válido', async () => {
      req = { headers: { token: 'valid-token' } };

      (loginService.validarToken as jest.Mock).mockResolvedValue(true);

      await validarToken(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(true);
    });

    it('deve retornar status 500 quando houver um erro ao validar o token', async () => {
      req = { headers: { token: 'invalid-token' } };

      (loginService.validarToken as jest.Mock).mockRejectedValue(new Error('Token invalid'));

      await validarToken(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith('Erro ao validar o token');
    });
  });

  describe('cadastrarLogin', () => {
    it('deve retornar sucesso quando cadastro for efetuado', async () => {
      const req = {
        body: {},
        headers: {
          authorization: 'Bearer fake-token',
        },
      } as unknown as Request;
    
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const retorno = {
        status: 201,
        message: 'Cadastro efetuado com sucesso',
      };

      (loginService.cadastrarLogin as jest.Mock).mockResolvedValue(retorno);

      await cadastrarLogin(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Cadastro efetuado com sucesso' });
    });

    it('deve retornar erro quando o cadastro falhar', async () => {
      const req = {
        body: {},
        headers: {
          authorization: 'Bearer fake-token',
        },
      } as unknown as Request;
    
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const retorno = {
        status: 400,
        message: 'Erro ao cadastrar o login',
      };

      (loginService.cadastrarLogin as jest.Mock).mockResolvedValue(retorno);

      await cadastrarLogin(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao cadastrar o login' });
    });

    it('deve retornar erro 500 caso ocorra um erro inesperado', async () => {
      (loginService.cadastrarLogin as jest.Mock).mockRejectedValue(new Error('Erro inesperado'));

      await cadastrarLogin({} as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao cadastrar o login' });
    });
  });
});
