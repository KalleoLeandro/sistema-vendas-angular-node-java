import { GenericResponseDto } from '@models/dto/generic-response-dto';
import { ProdutoAtualizacaoDto } from '@models/dto/produto-atualizacao-dto';
import { ProdutoCadastroDto } from '@models/dto/produto-cadastro-dto';
import { Controller, Delete, Get, Param, Post, Put, Query, Req, Res } from '@nestjs/common';
import { ApiBody, ApiCookieAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProdutoService } from '@services/produto/produto.service';
import { logger } from '@utils/utils';
import { Request, Response } from 'express';
import { Logger } from 'winston';

const log: Logger = logger;

@Controller()
export class ProdutoController {

    constructor(private readonly produtoService: ProdutoService) { }

    @Post('cadastrar-produto')
    @ApiCookieAuth()
    @ApiBody({
        description: 'Dados do produto',
        required: true,
        type: ProdutoCadastroDto,
    })
    @ApiOperation({ summary: 'Endpoint de Cadastro de produto' })
    @ApiResponse({
        status: 201,
        description: 'Cadastro realizado com sucesso',
        schema: {
            example: {}
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Bad Request',
        schema: {
            example: { message: 'Erro' },
        },
    })
    @ApiResponse({
        status: 500,
        description: 'Erro ao cadastrar o produto',
        schema: {
            example: { message: 'Erro ao cadastrar o produto' },
        },
    })
    async cadastrarProduto(@Req() req: Request, @Res() res: Response) {
        const cadastroproduto: ProdutoCadastroDto = req.body;
        const token: string = req.cookies.jwt;
        const retorno: GenericResponseDto = await this.produtoService.cadastrarProduto(cadastroproduto, token);
        return res.status(retorno.status).json({ message: retorno.message });
    }

    @Get('buscar-produto-por-id/:id')
    @ApiCookieAuth()
    @ApiOperation({ summary: 'Endpoint de retorno de um produto por id' })
    @ApiResponse({
        status: 200,
        description: 'produto localizado pelo id',
        type: ProdutoCadastroDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Bad Request',
        schema: {
            example: { message: 'Erro' },
        },
    })
    @ApiResponse({
        status: 500,
        description: 'Erro ao localizar o o produto',
        schema: {
            example: { message: 'Erro ao localizar o produto' },
        },
    })
    async buscarPorId(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
        const idBusca: string = id;
        const token: string = req.cookies.jwt;
        const cadastroProduto: any = await this.produtoService.buscarPorId(idBusca, token);
        return res.status(cadastroProduto.status).json(cadastroProduto.response);

    }

    @Get('buscar-produtos-por-pagina')
    @ApiCookieAuth()
    @ApiOperation({ summary: 'Endpoint de retorno de uma lista paginada de produtos ' })
    @ApiResponse({
        status: 200,
        description: 'produto localizado pelo id',
        schema: {
            example: [{ ProdutoCadastroDto }]
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Bad Request',
        schema: {
            example: { message: 'Erro' },
        },
    })
    @ApiResponse({
        status: 500,
        description: 'Erro ao buscar os produtos',
        schema: {
            example: { message: 'Erro ao buscar os produtos' },
        },
    })
    async buscarPorPagina(@Query('page') page: string, @Query('limit') limit: string, @Req() req: Request, @Res() res: Response) {
        const token: string = req.cookies.jwt;
        const listaProdutos = await this.produtoService.buscarPorPagina(page, limit, token);
        return res.status(listaProdutos.status).json(listaProdutos.response);
    }

    @Put('atualizar-produto')
    @ApiCookieAuth()
    @ApiBody({
        description: 'Dados para atualização de um produto',
        required: true,
        type: ProdutoAtualizacaoDto,
    })
    @ApiOperation({ summary: 'Endpoint de Atualização de produto' })
    @ApiResponse({
        status: 204,
        description: 'Produto atualizado com sucesso',
        schema: {
            example: {}
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Bad Request',
        schema: {
            example: { message: 'Erro' },
        },
    })
    @ApiResponse({
        status: 500,
        description: 'Erro ao atualizar o produto',
        schema: {
            example: { message: 'Erro ao atualizar o produto' },
        },
    })
    async atualizarProduto(@Req() req: Request, @Res() res: Response) {
        const atualizacaoProduto: ProdutoAtualizacaoDto = req.body;
        const token: string = req.cookies.jwt;
        const retorno: GenericResponseDto = await this.produtoService.atualizarProduto(atualizacaoProduto, token);
        return res.status(retorno.status).json({ message: retorno.message });
    }

    @Delete('excluir-produto/:id')
    @ApiCookieAuth()
    @ApiOperation({ summary: 'Endpoint de exclusão de produtos ' })
    @ApiResponse({
        status: 204,
        description: 'produto excluido pelo id',
        schema: {
            example: {},
        }
    })
    @ApiResponse({
        status: 400,
        description: 'Bad Request',
        schema: {
            example: { message: 'Erro' },
        },
    })
    @ApiResponse({
        status: 500,
        description: 'Erro ao excluir o produtos',
        schema: {
            example: { message: 'Erro ao excluir o produtos' },
        },
    })
    async excluirProduto(@Param('id') id: number, @Req() req: Request, @Res() res: Response) {
        const token: string = req.cookies.jwt;
        const retorno = await this.produtoService.excluirProduto(id, token);
        return res.status(retorno.status).json({ message: retorno.message });
    }
}
