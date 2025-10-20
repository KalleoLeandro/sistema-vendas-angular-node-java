import { CustomError } from '@errors/custom/custom-error';
import { UtilsService } from './utils.service';
import * as utils from '@utils/utils';

jest.mock('@utils/utils', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

global.fetch = jest.fn();
jest.mock('@environments/environments', () => ({
  environments: {
    BACK_END: 'http://mocked-api',
  },
}));

describe('UtilsService', () => {
  let service: UtilsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new UtilsService();
  });

  it('validarCpf() deve retornar response com status 200', async () => {
    const mockResponse = {
      valido: true
    };

    const token = 'abc';
    const cpf = '111.222.333-44';

    (fetch as jest.Mock).mockResolvedValue({
      status: 200,
      json: async () => mockResponse,
    });

    const result = await service.validarCpf(cpf, token);

    expect(result).toEqual({
      valido: true
    });
  });

  it('validarCpf() deve retornar response com status 200', async () => {    
    const token = 'abc';
    const cpf = '111.222.333-44';
    (fetch as jest.Mock).mockRejectedValue(new Error('Falha na rede'));
    await expect(service.validarCpf(cpf, token)).rejects.toThrow(CustomError);
    expect(utils.logger.error).toHaveBeenCalledWith('Erro: Error: Falha na rede');
  });
});
