import { teste } from '@controllers/testeController';
import { Request, Response } from 'express';

describe('Teste da função teste', () => {
  it('Deve retornar status 200 e mensagem correta', () => {    
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;
    
    const req = {} as Request;
    
    teste(req, res);
    
    expect(res.status).toHaveBeenCalledWith(200); 
    expect(res.json).toHaveBeenCalledWith({message: 'Teste Ok'}); 
  });
});