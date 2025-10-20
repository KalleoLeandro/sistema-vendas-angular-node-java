import { environments } from '@environments/environments';
import { CustomError } from '@errors/custom/custom-error';
import { GenericResponseDto } from '@models/dto/generic-response-dto';
import { ProdutoAtualizacaoDto } from '@models/dto/produto-atualizacao-dto';
import { ProdutoCadastroDto } from '@models/dto/produto-cadastro-dto';
import { Injectable } from '@nestjs/common';
import { logger } from '@utils/utils';
import { Logger } from 'winston';

const log: Logger = logger;

@Injectable()
export class ProdutoService {

    async cadastrarProduto(cadastroproduto: ProdutoCadastroDto, token: string) {
        try {
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`
                },
                body: JSON.stringify(cadastroproduto)
            }

            log.info("Executando a /api/produto/cadastrar-produto");
            const res = await fetch(`${environments.BACK_END}/produto/cadastrar-produto`, options);
            const status = res.status;
            let retorno: GenericResponseDto = {
                status, message: status === 201 ? 'Cadastro efetuado com sucesso' : 'Erro ao cadastrar o produto'
            };
            return retorno;
        } catch (error: any) {
            log.error(`Erro: ${error}`);
            throw new CustomError(error.message, 500);
        }
    }

    async atualizarProduto(atualizacaoProduto: ProdutoAtualizacaoDto, token: string) {
        try {
            const options = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(atualizacaoProduto)
            }

            log.info("Executando a /api/produto/atualizar-produto");
            const res = await fetch(`${environments.BACK_END}/produto/atualizar-produto`, options);
            const status = res.status;
            let retorno: GenericResponseDto = {
                status, message: status === 204 ? 'Produto atualizado com sucesso' : 'Erro ao atualizar o produto'
            };
            return retorno;
        } catch (error: any) {
            log.error(`Erro: ${error}`);
            throw new CustomError(error.message, 500);
        }
    }

    async buscarPorId(id: string, token: string) {
        try {
            const options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`
                }
            }

            log.info("Executando a /api/produto/buscar-por-id/{id}");
            const res = await fetch(`${environments.BACK_END}/produto/buscar-por-id/${id}`, options);
            const status = res.status;
            let retorno;
            if (status === 204) {
                retorno = {
                    status: 204,
                    message: `Produto não encontrado`
                };
            } else if (status === 200) {
                const response = await res.json();
                retorno = {
                    status: 200,
                    response
                };
            } else {
                retorno = {
                    status,
                    message: `Erro interno do servidor`
                };
            }
            return retorno;
        } catch (error: any) {
            log.error(`Erro: ${error}`);
            throw new CustomError(error.message, error.status);
        }
    }

    async buscarPorPagina(page: string, limit: string, token: string) {
        try {
            const options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`
                }
            }

            log.info("Executando a /api/produto/listar-todos-por-pagina");
            const res = await fetch(`${environments.BACK_END}/produto/listar-todos-por-pagina?limit=${limit}&page=${page}`, options);
            const status = res.status;
            let retorno;
            if (status === 204) {
                retorno = {
                    status: 204,
                    message: `Não há ítens cadastrados`
                };
            } else if (status === 200) {
                const response = await res.json();
                retorno = {
                    status: 200,
                    response
                };
            } else {
                retorno = {
                    status,
                    message: `Erro interno do servidor`
                };
            }
            return retorno;
        } catch (error: any) {
            log.error(`Erro: ${error}`);
            throw new CustomError(error.message, error.status);
        }
    }

    async excluirProduto(id: number, token: string) {
        try {
            const options = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`
                }
            }

            log.info("Executando a /api/produto/excluir-produto");
            const res = await fetch(`${environments.BACK_END}/produto/excluir-produto/${id}`, options);
            const status = res.status;
            let retorno;
            if (status === 204) {
                retorno = {
                    status: 204,
                    message: `Produto excluído com sucesso`
                };
            } else {
                retorno = {
                    status,
                    message: `Erro ao excluir o produto`
                };
            }
            return retorno;
        } catch (error: any) {
            log.error(`Erro: ${error}`);
            throw new CustomError(error.message, error.status);
        }
    }
}
