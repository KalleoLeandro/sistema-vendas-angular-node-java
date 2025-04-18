import { Request, Response } from 'express';
import * as loginService from '@services/loginService';
import { CustomError } from '@errors/customError';
import { decriptografia } from '@utils/utils';
import { validarLogin, validarToken } from '@controllers/loginController';

// Mock das dependências
jest.mock('@services/loginService');
jest.mock('@utils/utils', () => ({
  decriptografia: jest.fn(),
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

describe('loginController', () => {
  
  describe('validarLogin', () => {
    it('deve retornar status 200 com um token quando a validação for bem-sucedida', async () => {
      const req = {
        body: { hash: 'valid-hash' },
      } as unknown as Request;
      
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      
      const mockDecrypted = '{"username":"admin","password":"password"}';
      const mockReturn = {
        status: 200,
        token: 'valid-token',
        expiration: '2025-12-31',
        message: 'Login successful',
      };

      // Simulando comportamento da função decriptografia
      (decriptografia as jest.Mock).mockReturnValue(mockDecrypted);
      (loginService.validarLogin as jest.Mock).mockResolvedValue(mockReturn);

      await validarLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        token: 'valid-token',
        expiration: '2025-12-31',
        status: 200,
        message: 'Login successful',
      });
    });

    it('deve retornar erro 500 quando o hash estiver ausente', async () => {
      const req = {
        body: {},
      } as unknown as Request;
      
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await validarLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith('Erro ao validar o login');
    });

    it('deve retornar erro 500 quando não for possível descriptografar o hash', async () => {
      const req = {
        body: { hash: 'invalid-hash' },
      } as unknown as Request;
      
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      (decriptografia as jest.Mock).mockReturnValue(null);

      await validarLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith('Erro ao validar o login');
    });

    it('deve retornar status 400 quando o retorno do loginService for inválido', async () => {
      const req = {
        body: { hash: 'valid-hash' },
      } as unknown as Request;
      
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const mockDecrypted = '{"username":"admin","password":"password"}';
      const mockReturn = {
        status: 400,
        message: 'Invalid credentials',
      };

      (decriptografia as jest.Mock).mockReturnValue(mockDecrypted);
      (loginService.validarLogin as jest.Mock).mockResolvedValue(mockReturn);

      await validarLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });
  });

  describe('validarToken', () => {
    it('deve retornar status 200 com verdadeiro quando o token for válido', async () => {
      const req = {
        headers: { token: 'valid-token' },
      } as unknown as Request;
      
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      (loginService.validarToken as jest.Mock).mockResolvedValue(true);

      await validarToken(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(true);
    });

    it('deve retornar status 500 quando houver um erro ao validar o token', async () => {
      const req = {
        headers: { token: 'invalid-token' },
      } as unknown as Request;
      
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      (loginService.validarToken as jest.Mock).mockRejectedValue(new Error('Token invalid'));

      await validarToken(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith('Erro ao validar o token');
    });
  });
});
