import { ProdutoCadastroDto } from "@models/dto/produto-cadastro-dto";
import { ProdutoService } from "./produto.service";
import * as utils from '@utils/utils';
import { CustomError } from "@errors/custom/custom-error";
import { ProdutoAtualizacaoDto } from "@models/dto/produto-atualizacao-dto";

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

describe('ProdutoService', () => {
  let service: ProdutoService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ProdutoService();
  });

  const mockCadastrarBody: ProdutoCadastroDto = {
    nome: "teste",
    precoCusto: 10.0,
    precoVenda: 15.0,
    quantidade: 1,
    medida: 1,
    categoria: 1
  };
  const mockAtualizarBody: ProdutoAtualizacaoDto = {
    id: 2,
    nome: "teste",
    precoCusto: 10.0,
    precoVenda: 15.0,
    quantidade: 1,
    medida: 1,
    categoria: 1
  };

  it('cadastrarProduto() deve retornar GenericResponseDto com status 201', async () => {
    const mockResponse = {
      message: 'Cadastro efetuado com sucesso'
    };

    const token = 'abc';

    (fetch as jest.Mock).mockResolvedValue({
      status: 201,
      json: async () => mockResponse,
    });

    const result = await service.cadastrarProduto(mockAtualizarBody, token);

    expect(result).toEqual({
      status: 201,
      message: 'Cadastro efetuado com sucesso'
    });
    expect(utils.logger.info).toHaveBeenCalledWith(
      'Executando a /api/produto/cadastrar-produto'
    );
  });

  it('cadastrarProduto() deve retornar GenericResponseDto com status 400', async () => {
    const mockResponse = {
      message: 'Bad request'
    };

    const token = 'abc';

    (fetch as jest.Mock).mockResolvedValue({
      status: 400,
      json: async () => mockResponse,
    });

    const result = await service.cadastrarProduto(mockCadastrarBody, token);

    expect(result).toEqual({
      status: 400,
      message: 'Erro ao cadastrar o produto'
    });
    expect(utils.logger.info).toHaveBeenCalledWith(
      'Executando a /api/produto/cadastrar-produto'
    );
  });

  it('cadastrarProduto() deve lançar CustomError em exceção', async () => {
    const token = 'abc';
    (fetch as jest.Mock).mockRejectedValue(new Error('Falha na rede'));

    await expect(service.cadastrarProduto(mockCadastrarBody, token)).rejects.toThrow(CustomError);
    expect(utils.logger.error).toHaveBeenCalledWith('Erro: Error: Falha na rede');
  });

  it('cadastrarProduto() deve lançar CustomError em exceção', async () => {
    const token = 'abc';
    (fetch as jest.Mock).mockRejectedValue(new Error('Falha na rede'));

    await expect(service.cadastrarProduto(mockCadastrarBody, token)).rejects.toThrow(CustomError);
    expect(utils.logger.error).toHaveBeenCalledWith('Erro: Error: Falha na rede');
  });

  it('atualizarProduto() deve retornar GenericResponseDto com status 204', async () => {
    const mockResponse = {
      message: 'Atualização efetuada com sucesso'
    };

    const token = 'abc';

    (fetch as jest.Mock).mockResolvedValue({
      status: 204,
      json: async () => mockResponse,
    });

    const result = await service.atualizarProduto(mockAtualizarBody, token);

    expect(result).toEqual({
      status: 204,
      message: 'Produto atualizado com sucesso'
    });
    expect(utils.logger.info).toHaveBeenCalledWith(
      'Executando a /api/produto/atualizar-produto'
    );
  });

  it('atualizarProduto() deve retornar GenericResponseDto com status 400', async () => {
    const mockResponse = {
      message: 'Erro ao atualizar o produto'
    };

    const token = 'abc';

    (fetch as jest.Mock).mockResolvedValue({
      status: 400,
      json: async () => mockResponse,
    });

    const result = await service.atualizarProduto(mockAtualizarBody, token);

    expect(result).toEqual({
      status: 400,
      message: 'Erro ao atualizar o produto'
    });
    expect(utils.logger.info).toHaveBeenCalledWith(
      'Executando a /api/produto/atualizar-produto'
    );
  });

  it('atualizarProduto() deve lançar CustomError em exceção', async () => {
    const token = 'abc';
    (fetch as jest.Mock).mockRejectedValue(new Error('Falha na rede'));

    await expect(service.atualizarProduto(mockAtualizarBody, token)).rejects.toThrow(CustomError);
    expect(utils.logger.error).toHaveBeenCalledWith('Erro: Error: Falha na rede');
  });

  it('buscarPorId() deve retornar um produto com status 200', async () => {
    const mockResponse = {
      id: 2,
      nome: "teste",
      precoCusto: 10.0,
      precoVenda: 15.0,
      quantidade: 1,
      medida: 1,
      categoria: 1
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
      `Executando a /api/produto/buscar-por-id/{id}`
    );
  });

  it('buscarPorId() deve retornar um produto com status 204', async () => {

    const token = 'abc';

    (fetch as jest.Mock).mockResolvedValue({
      status: 204
    });

    const result = await service.buscarPorId('2', token);

    expect(result).toEqual({
      status: 204,
      message: `Produto não encontrado`
    });
    expect(utils.logger.info).toHaveBeenCalledWith(
      `Executando a /api/produto/buscar-por-id/{id}`
    );
  });

  it('buscarPorId() deve retornar um produto com status 500', async () => {
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
      `Executando a /api/produto/buscar-por-id/{id}`
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
      `Executando a /api/produto/listar-todos-por-pagina`
    );
  });

  it('buscarPorPagina() deve retornar status 200', async () => {
    const mockResponse = [{
      id: 2,
      nome: "teste",
      precoCusto: 10.0,
      precoVenda: 15.0,
      quantidade: 1,
      medida: 1,
      categoria: 1
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
      `Executando a /api/produto/listar-todos-por-pagina`
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
      `Executando a /api/produto/listar-todos-por-pagina`
    );
  });

  it('buscarPorPagina() deve lançar um CustomError', async () => {
    const token = 'abc';
    (fetch as jest.Mock).mockRejectedValue(new Error('Falha na rede'));

    await expect(service.buscarPorPagina('1', '10', token)).rejects.toThrow(CustomError);
    expect(utils.logger.error).toHaveBeenCalledWith('Erro: Error: Falha na rede');
  });

  it('excluirProduto() deve retornar status 204', async () => {
      const token = 'abc';
  
      (fetch as jest.Mock).mockResolvedValue({
        status: 204,
      });
  
      const result = await service.excluirProduto(2, token);
  
      expect(result).toEqual({
        status: 204,
        message: 'Produto excluído com sucesso'
      });
      expect(utils.logger.info).toHaveBeenCalledWith(
        `Executando a /api/produto/excluir-produto`
      );
    });
  
    it('excluirProduto() deve retornar status 400', async () => {
      const token = 'abc';
  
      (fetch as jest.Mock).mockResolvedValue({
        status: 400,
      });
  
      const result = await service.excluirProduto(2, token);
  
      expect(result).toEqual({
        status: 400,
        message: 'Erro ao excluir o produto'
      });
      expect(utils.logger.info).toHaveBeenCalledWith(
        `Executando a /api/produto/excluir-produto`
      );
    });
  
    it('excluirProduto() deve lançar um CustomError', async () => {
     const token = 'abc';
      (fetch as jest.Mock).mockRejectedValue(new Error('Falha na rede'));
  
      await expect(service.excluirProduto(2, token)).rejects.toThrow(CustomError);
      expect(utils.logger.error).toHaveBeenCalledWith('Erro: Error: Falha na rede');
    });
});