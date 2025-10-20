import { LoginService } from '@services/login/login.service';
import { CustomError } from '@errors/custom/custom-error';
import { LoginRequest } from '@models/interfaces/login-request';
import * as utils from '@utils/utils';
import { LoginAtualizacaoDto } from '@models/dto/login-atualizacao-dto';
import { LoginCadastroDto } from '@models/dto/login-cadastro-dto';

jest.mock('@utils/utils', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));
jest.mock('@environments/environments', () => ({
  environments: {
    BACK_END: 'http://mocked-api',
  },
}));

global.fetch = jest.fn();

describe('LoginService', () => {
  let service: LoginService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new LoginService();
  });

  const mockLoginBody: LoginRequest = { user: 'teste', password: '123' } as any;
  const mockCadastrarBody: LoginCadastroDto = { nome: 'teste', cpf: '222.333.444-05', login: 'teste', senha: 'teste', perfil: 'dev' } as any;
  const mockAtualizarBody: LoginAtualizacaoDto = { id: 2, nome: 'teste', cpf: '222.333.444-05', login: 'teste', senha: 'teste', perfil: 'dev' } as any;


  it('validarLogin() deve retornar LoginResponse com status 200', async () => {
    const mockResponse = {
      token: 'abc123',
      expiration: '2025-10-15T00:00:00Z',
      userName: 'Kalleo',
    };

    (fetch as jest.Mock).mockResolvedValue({
      status: 200,
      json: async () => mockResponse,
    });

    const result = await service.validarLogin(mockLoginBody);

    expect(result).toEqual({
      token: 'abc123',
      expiration: '2025-10-15T00:00:00Z',
      userName: 'Kalleo',
      status: 200,
    });
    expect(utils.logger.info).toHaveBeenCalledWith(
      'Executando a /api/login/validar-login'
    );
  });

  it('validarLogin() deve retornar LoginResponse com status 401', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      status: 401,
      json: async () => ({ message: 'Credenciais inválidas' }),
    });

    const result = await service.validarLogin(mockLoginBody);

    expect(result).toEqual({
      status: 401,
      message: 'Credenciais inválidas',
    });
  });

  it('validarLogin() deve retornar LoginResponse com status 500 para erro genérico', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      status: 500,
      json: async () => ({ message: 'Erro interno' }),
    });

    const result = await service.validarLogin(mockLoginBody);

    expect(result).toEqual({
      status: 500,
      message: 'Erro interno',
    });
  });

  it('validarLogin() deve lançar CustomError em exceção', async () => {
    (fetch as jest.Mock).mockRejectedValue(new Error('Falha na rede'));

    await expect(service.validarLogin(mockLoginBody)).rejects.toThrow(CustomError);
    expect(utils.logger.error).toHaveBeenCalledWith('Erro: Error: Falha na rede');
  });

  it('validarToken() deve retornar boolean true', async () => {
    const token = 'abc';

    (fetch as jest.Mock).mockResolvedValue({
      status: 200,
      json: async () => (true),
    });

    const result = await service.validarToken(token);

    expect(result).toEqual(true);
  });

  it('validarToken() deve lançar um CustomError', async () => {
    const token = 'abc';
    (fetch as jest.Mock).mockRejectedValue(new Error('Falha na rede'));

    await expect(service.validarToken(token)).rejects.toThrow(CustomError);
    expect(utils.logger.error).toHaveBeenCalledWith('Erro: Error: Falha na rede');
  });

  it('cadastrarLogin() deve retornar GenericResponseDto com status 201', async () => {
    const mockResponse = {
      message: 'Cadastro efetuado com sucesso'
    };

    const token = 'abc';

    (fetch as jest.Mock).mockResolvedValue({
      status: 201,
      json: async () => mockResponse,
    });

    const result = await service.cadastrarLogin(mockAtualizarBody, token);

    expect(result).toEqual({
      status: 201,
      message: 'Cadastro efetuado com sucesso'
    });
    expect(utils.logger.info).toHaveBeenCalledWith(
      'Executando a /api/login/cadastrar-login'
    );
  });

  it('cadastrarLogin() deve retornar GenericResponseDto com status 400', async () => {
    const mockResponse = {
      message: 'Bad request'
    };

    const token = 'abc';

    (fetch as jest.Mock).mockResolvedValue({
      status: 400,
      json: async () => mockResponse,
    });

    const result = await service.cadastrarLogin(mockCadastrarBody, token);

    expect(result).toEqual({
      status: 400,
      message: 'Erro ao cadastrar o login'
    });
    expect(utils.logger.info).toHaveBeenCalledWith(
      'Executando a /api/login/cadastrar-login'
    );
  });

  it('cadastrarLogin() deve lançar CustomError em exceção', async () => {
    const token = 'abc';
    (fetch as jest.Mock).mockRejectedValue(new Error('Falha na rede'));

    await expect(service.cadastrarLogin(mockCadastrarBody, token)).rejects.toThrow(CustomError);
    expect(utils.logger.error).toHaveBeenCalledWith('Erro: Error: Falha na rede');
  });

  it('atualizarLogin() deve retornar GenericResponseDto com status 204', async () => {
    const mockResponse = {
      message: 'Atualização efetuada com sucesso'
    };

    const token = 'abc';

    (fetch as jest.Mock).mockResolvedValue({
      status: 204,
      json: async () => mockResponse,
    });

    const result = await service.atualizarLogin(mockAtualizarBody, token);

    expect(result).toEqual({
      status: 204,
      message: 'Login atualizado com sucesso'
    });
    expect(utils.logger.info).toHaveBeenCalledWith(
      'Executando a /api/login/atualizar-login'
    );
  });

  it('atualizarLogin() deve retornar GenericResponseDto com status 400', async () => {
    const mockResponse = {
      message: 'Erro ao atualizar o login'
    };

    const token = 'abc';

    (fetch as jest.Mock).mockResolvedValue({
      status: 400,
      json: async () => mockResponse,
    });

    const result = await service.atualizarLogin(mockAtualizarBody, token);

    expect(result).toEqual({
      status: 400,
      message: 'Erro ao atualizar o login'
    });
    expect(utils.logger.info).toHaveBeenCalledWith(
      'Executando a /api/login/atualizar-login'
    );
  });

  it('atualizarLogin() deve lançar CustomError em exceção', async () => {
    const token = 'abc';
    (fetch as jest.Mock).mockRejectedValue(new Error('Falha na rede'));

    await expect(service.atualizarLogin(mockAtualizarBody, token)).rejects.toThrow(CustomError);
    expect(utils.logger.error).toHaveBeenCalledWith('Erro: Error: Falha na rede');
  });

  it('buscarPorId() deve retornar um login com status 200', async () => {
    const mockResponse = {
      id: 2,
      nome: "teste",
      cpf: "222.333.444-05",
      login: "teste",
      senha: "teste",
      perfil: "adm"
    };

    const token = 'abc';

    (fetch as jest.Mock).mockResolvedValue({
      status: 200,
      json: async () => mockResponse,
    });

    const result = await service.buscarPorId('2', token);

    expect(result).toEqual({
      status: 200,
      response: mockResponse
    });
    expect(utils.logger.info).toHaveBeenCalledWith(
      `Executando a /api/login/buscar-por-id/2`
    );
  });

  it('buscarPorId() deve retornar um login com status 204', async () => {

    const token = 'abc';

    (fetch as jest.Mock).mockResolvedValue({
      status: 204
    });

    const result = await service.buscarPorId('2', token);

    expect(result).toEqual({
      status: 204,
      message: `Usuário não encontrado`
    });
    expect(utils.logger.info).toHaveBeenCalledWith(
      `Executando a /api/login/buscar-por-id/2`
    );
  });

  it('buscarPorId() deve retornar um login com status 500', async () => {

    const token = 'abc';

    (fetch as jest.Mock).mockResolvedValue({
      status: 500
    });

    const result = await service.buscarPorId('2', token);

    expect(result).toEqual({
      status: 500,
      message: `Erro interno do servidor`
    });
    expect(utils.logger.info).toHaveBeenCalledWith(
      `Executando a /api/login/buscar-por-id/2`
    );
  });

  it('buscarPorId() deve lançar um CustomError', async () => {
    const token = 'abc';
    (fetch as jest.Mock).mockRejectedValue(new Error('Falha na rede'));

    await expect(service.buscarPorId('2', token)).rejects.toThrow(CustomError);
    expect(utils.logger.error).toHaveBeenCalledWith('Erro: Error: Falha na rede');
  });

  it('buscarPorPagina() deve retornar status 204', async () => {
    const token = 'abc';

    (fetch as jest.Mock).mockResolvedValue({
      status: 204
    });

    const result = await service.buscarPorPagina('1', '10', token);

    expect(result).toEqual({
      status: 204,
      message: `Não há ítens cadastrados`
    });
    expect(utils.logger.info).toHaveBeenCalledWith(
      `Executando a /api/login/listar-todos-por-pagina`
    );
  });

  it('buscarPorPagina() deve retornar status 200', async () => {
    const mockResponse = [{
      id: 2,
      nome: "teste",
      cpf: "222.333.444-05",
      login: "teste",
      senha: "teste",
      perfil: "adm"
    }];

    const token = 'abc';

    (fetch as jest.Mock).mockResolvedValue({
      status: 200,
      json: async () => mockResponse,
    });

    const result = await service.buscarPorPagina('1', '10', token);

    expect(result).toEqual({
      status: 200,
      response: mockResponse
    });
    expect(utils.logger.info).toHaveBeenCalledWith(
      `Executando a /api/login/listar-todos-por-pagina`
    );
  });

  it('buscarPorPagina() deve retornar status 400', async () => {

    const token = 'abc';

    (fetch as jest.Mock).mockResolvedValue({
      status: 400,
    });

    const result = await service.buscarPorPagina('1', '10', token);

    expect(result).toEqual({
      status: 400,
      message: 'Erro interno do servidor'
    });
    expect(utils.logger.info).toHaveBeenCalledWith(
      `Executando a /api/login/listar-todos-por-pagina`
    );
  });

  it('buscarPorPagina() deve lançar um CustomError', async () => {
    const token = 'abc';
    (fetch as jest.Mock).mockRejectedValue(new Error('Falha na rede'));

    await expect(service.buscarPorPagina('1', '10', token)).rejects.toThrow(CustomError);
    expect(utils.logger.error).toHaveBeenCalledWith('Erro: Error: Falha na rede');
  });

  it('excluirLogin() deve retornar status 204', async () => {
    const token = 'abc';

    (fetch as jest.Mock).mockResolvedValue({
      status: 204,
    });

    const result = await service.excluirLogin(2, token);

    expect(result).toEqual({
      status: 204,
      message: 'Usuário excluído com sucesso'
    });
    expect(utils.logger.info).toHaveBeenCalledWith(
      `Executando a /api/login/excluir-login`
    );
  });

  it('excluirLogin() deve retornar status 400', async () => {
    const token = 'abc';

    (fetch as jest.Mock).mockResolvedValue({
      status: 400,
    });

    const result = await service.excluirLogin(2, token);

    expect(result).toEqual({
      status: 400,
      message: 'Erro ao excluir o login'
    });
    expect(utils.logger.info).toHaveBeenCalledWith(
      `Executando a /api/login/excluir-login`
    );
  });

  it('excluirLogin() deve lançar um CustomError', async () => {
   const token = 'abc';
    (fetch as jest.Mock).mockRejectedValue(new Error('Falha na rede'));

    await expect(service.excluirLogin(2, token)).rejects.toThrow(CustomError);
    expect(utils.logger.error).toHaveBeenCalledWith('Erro: Error: Falha na rede');
  });
});
