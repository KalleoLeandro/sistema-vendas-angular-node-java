import { TestingModule, Test } from "@nestjs/testing";
import { ProdutoController } from "./produto.controller";
import { Response } from "express";
import { ProdutoService } from "@services/produto/produto.service";

describe('ProdutoController', () => {
    let controller: ProdutoController;

    const mockResponse = () => {
        const res: Partial<Response> = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res as Response;
    };

    const mockProdutoService = {
        cadastrarProduto: jest.fn(),
        atualizarProduto: jest.fn(),
        buscarPorId: jest.fn(),
        buscarPorPagina: jest.fn(),
        excluirProduto: jest.fn()
    }

    const mockReq = {
        json: jest.fn(),
        cookies: jest.fn()
    } as any;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProdutoController],
            providers: [
                {
                    provide: ProdutoService,
                    useValue: mockProdutoService,
                },
            ],
        }).compile();

        controller = module.get<ProdutoController>(ProdutoController);

        jest.mock('@utils/utils', () => ({
            logger: {
                info: jest.fn(),
                error: jest.fn(),
            }
        }));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('POST/cadastrar-produto - deve chamar o ProdutoService e cadastrar o novo produto', async () => {
        const res = mockResponse();

        mockReq.cookies = { jwt: 'token123' };
        mockProdutoService.cadastrarProduto.mockResolvedValue({ status: 200, message: 'Produto cadastrado com sucesso!' });

        await controller.cadastrarProduto(mockReq, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Produto cadastrado com sucesso!' });
    });

    it('PUT /atualizar-produto — deve atualizar produto', async () => {
        const res = mockResponse();
        mockProdutoService.atualizarProduto.mockResolvedValue({ status: 204, message: 'OK' });
        await controller.atualizarProduto(mockReq, res);
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.json).toHaveBeenCalled();
    });

    it('GET /buscar-produto-por-id/:id — deve buscar produto', async () => {
        const res = mockResponse();

        mockReq.params = { id: '1' };
        mockProdutoService.buscarPorId.mockResolvedValue({ status: 200, id: 1 });

        await controller.buscarPorId('1', mockReq, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalled();
    });

    it('GET /buscar-produtos-por-pagina — deve buscar paginado', async () => {
        const res = mockResponse();
        mockReq.query = { page: '1', limit: '5' };
        mockProdutoService.buscarPorPagina.mockResolvedValue({ status: 200, response: [] });

        await controller.buscarPorPagina('1', '5', mockReq, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalled();
    });

    it('DELETE /excluir-produto/:id — deve excluir produto', async () => {
        const res = mockResponse();
        mockReq.params = { id: '1' };
        mockProdutoService.excluirProduto.mockResolvedValue({ status: 204, message: 'OK' });

        await controller.excluirProduto(1, mockReq, res);

        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.json).toHaveBeenCalledWith({ message: 'OK' });
    });
});
