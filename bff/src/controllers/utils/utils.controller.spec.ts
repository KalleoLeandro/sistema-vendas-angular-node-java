import { Test, TestingModule } from '@nestjs/testing';
import { UtilsController } from './utils.controller';
import { Request, Response } from 'express';
import { UtilsService } from '@services/utils/utils.service';

describe('UtilsController', () => {
  let controller: UtilsController;

  const mockResponse = () => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response;
  };

  const mockReq = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    cookie: jest.fn()
  } as any;

  const mockUtilsService = {
    validarCpf: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UtilsController],
      providers: [
        {
          provide: UtilsService,
          useValue: mockUtilsService,
        },
      ],
    }).compile();

    controller = module.get<UtilsController>(UtilsController);
  });

  it('deve chamar o UtilsService e retornar o cpf com status correto', async () => {
    mockReq.cookies = { jwt: 'token123' };
    const res = mockResponse();

    const retorno = true;
    mockUtilsService.validarCpf.mockResolvedValue({valido: retorno});

    await controller.validarCpf({ cpf: '222.333.444-05' } as any, mockReq, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({valido: true});
  });
});
