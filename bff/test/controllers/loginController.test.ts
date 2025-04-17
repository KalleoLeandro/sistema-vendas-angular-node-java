import { Request, Response } from 'express';
import * as loginController from '@controllers/loginController';
import * as loginService from '@services/loginService';
import { decriptografia } from '@utils/utils';

jest.mock('@services/loginService');
jest.mock('@utils/utils');

describe('loginController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn()
    };
  });

  describe('validarLogin', () => {
    it('retorna 200 com sucesso no login e define cookie', async () => {
      (decriptografia as jest.Mock).mockReturnValue(JSON.stringify({ userName: 'user', password: 'pass' }));
      (loginService.validarLogin as jest.Mock).mockResolvedValue({
        status: 200,
        token: 'abc',
        message: 'Login realizado com sucesso',
        expiration: 3600000
      });

      req.body = { hash: 'abc' };

      await loginController.validarLogin(req as Request, res as Response);

      expect(res.cookie).toHaveBeenCalledWith("token", "abc", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 3600000
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 200,
        message: 'Login realizado com sucesso',
        expiration: 3600000
      });
    });

    it('retorna status diferente de 200 com mensagem', async () => {
      (decriptografia as jest.Mock).mockReturnValue(JSON.stringify({ userName: 'user', password: 'wrong' }));
      (loginService.validarLogin as jest.Mock).mockResolvedValue({
        status: 401,
        message: 'Credenciais inválidas'
      });

      req.body = { hash: 'hasherrado' };

      await loginController.validarLogin(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Credenciais inválidas' });
    });

    it('retorna 500 em caso de erro', async () => {
      (decriptografia as jest.Mock).mockReturnValue(JSON.stringify({ userName: 'user', password: 'error' }));
      (loginService.validarLogin as jest.Mock).mockRejectedValue(new Error('Erro interno'));

      req.body = { hash: 'erro' };

      await loginController.validarLogin(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith('Error: Erro interno');
    });
  });

  describe('validarToken', () => {
    it('retorna 200 ao validar token com sucesso', async () => {
      (loginService.validarToken as jest.Mock).mockResolvedValue({ valido: true });

      req.cookies = { token: 'abc' };

      await loginController.validarToken(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ valido: true });
    });

    it('retorna 500 em caso de erro ao validar token', async () => {
      (loginService.validarToken as jest.Mock).mockRejectedValue(new Error('Token inválido'));

      req.cookies = { token: 'abc' };

      await loginController.validarToken(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith('Error: Token inválido');
    });
  });
});
