import { CustomError } from '@errors/customError';
import { verificaTokenValido } from '@middlewares/middleware';
import * as loginService from '@services/loginService';
import { Request, Response, NextFunction } from 'express';


describe('middleware', () => {
    describe('verificaTokenValido', () => {
        it('deve chamar next() se o token for válido', async () => {
            const mockReq = {
              headers: {
                authorization: 'Bearer tokenvalido'
              }
            } as Partial<Request> as Request;
          
            const mockRes = {
              status: jest.fn()
            } as Partial<Response> as Response;
          
            const mockNext = jest.fn();
          
            jest.spyOn(loginService, 'validarToken').mockResolvedValue(true);
          
            await verificaTokenValido(mockReq, mockRes, mockNext);
          
            expect(loginService.validarToken).toHaveBeenCalledWith('Bearer tokenvalido');
            expect(mockNext).toHaveBeenCalled();
            expect(mockRes.status).not.toHaveBeenCalled();
          });
          

        it('deve retornar 401 se o token for inválido', async () => {
            const mockReq = {
              headers: {
                authorization: 'Bearer tokeninvalido'
              }
            } as Partial<Request> as Request;
        
            const endMock = jest.fn();
            const statusMock = jest.fn().mockReturnValue({ end: endMock });
        
            const mockRes = {
              status: statusMock
            } as Partial<Response> as Response;
        
            const mockNext = jest.fn();
        
            jest.spyOn(loginService, 'validarToken').mockResolvedValue(false);
        
            await verificaTokenValido(mockReq, mockRes, mockNext);
        
            expect(loginService.validarToken).toHaveBeenCalledWith('Bearer tokeninvalido');
            expect(statusMock).toHaveBeenCalledWith(401);
            expect(endMock).toHaveBeenCalled();
            expect(mockNext).not.toHaveBeenCalled();
          });

          it('deve retornar 500 se houver erro na verificação do token', async () => {
            const mockReq = {
              headers: {
                authorization: 'Bearer qualquer coisa'
              }
            } as Partial<Request> as Request;
          
            const endMock = jest.fn();
            const statusMock = jest.fn().mockReturnValue({ end: endMock });
          
            const mockRes = {
              status: statusMock
            } as Partial<Response> as Response;
          
            const mockNext = jest.fn();
          
            jest.spyOn(loginService, 'validarToken').mockRejectedValue(new Error('Erro na verificação'));
          
            await verificaTokenValido(mockReq, mockRes, mockNext);
          
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(endMock).toHaveBeenCalled();
            expect(mockNext).not.toHaveBeenCalled();
          });          
    });
});