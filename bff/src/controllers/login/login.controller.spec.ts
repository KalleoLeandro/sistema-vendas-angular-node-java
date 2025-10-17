import { Test, TestingModule } from '@nestjs/testing';
import { LoginController } from './login.controller';
import { LoginService } from '@services/login/login.service';
import { Response } from 'express';
import { CustomError } from '@errors/custom/custom-error';
import * as utils from '@utils/utils';

describe('LoginController', () => {
  let controller: LoginController;
  let loginService: LoginService;

  const mockResponse = () => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response;
  };

  const mockLoginService = {
    validarLogin: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoginController],
      providers: [
        {
          provide: LoginService,
          useValue: mockLoginService,
        },
      ],
    }).compile();

    controller = module.get<LoginController>(LoginController);
    loginService = module.get<LoginService>(LoginService);
    
    jest.mock('@utils/utils', () => ({
      logger: {
        info: jest.fn(),
        error: jest.fn(),
      },
      decriptografia: jest.fn(),
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve lançar erro se o hash estiver ausente', async () => {
    const res = mockResponse();

    await expect(controller.validarLogin({ hash: '' } as any, res))
      .rejects
      .toThrow(new CustomError('Hash inválido ou ausente', 500));
  });

  it('deve lançar erro se o hash não for descriptografado', async () => {
    const res = mockResponse();
    jest.spyOn(utils, 'decriptografia').mockReturnValue('');

    await expect(controller.validarLogin({ hash: 'abc' } as any, res))
      .rejects
      .toThrow(new CustomError('Falha ao descriptografar o hash', 500));
  });

  it('deve chamar o LoginService e retornar o JSON com status correto', async () => {
    const res = mockResponse();

    const decrypted = JSON.stringify({ user: 'admin', password: '123' });
    jest.spyOn(utils, 'decriptografia').mockReturnValue(decrypted);

    const retorno = { status: 200, token: 'abc', userName: 'admin' };
    mockLoginService.validarLogin.mockResolvedValue(retorno);

    await controller.validarLogin({ hash: 'validHash' } as any, res);

    expect(mockLoginService.validarLogin).toHaveBeenCalledWith({ user: 'admin', password: '123' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(retorno);
  });
});
