import { environments } from '@environments/environments';
import { CustomError } from '@errors/custom/custom-error';
import { GenericResponseDto } from '@models/dto/generic-response-dto';
import { LoginAtualizacaoDto } from '@models/dto/login-atualizacao-dto';
import { LoginCadastroDto } from '@models/dto/login-cadastro-dto';
import { LoginResponseDto } from '@models/dto/login-reponse-dto';
import { LoginRequest } from '@models/interfaces/login-request';
import { LoginResponse } from '@models/interfaces/login-response';
import { Injectable } from '@nestjs/common';
import { logger } from '@utils/utils';

const log = logger;

@Injectable()
export class LoginService {

    async validarLogin(body: LoginRequest) {
        try {
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            };

            log.info("Executando a /api/login/validar-login");
            const res = await fetch(`${environments.BACK_END}/login/validar-login`, options);
            const statusCode = res.status;
            const response: LoginResponseDto = await res.json();
            let retorno: LoginResponseDto;

            if (statusCode === 200) {
                retorno = {
                    token: response.token,
                    expiration: response.expiration,
                    userName: response.userName,
                    status: 200
                };
            } else if (statusCode === 401) {
                retorno = {
                    status: 401,
                    message: response.message
                };
            } else {

                retorno = {
                    status: 500,
                    message: response.message
                };
            }
            return retorno;
        } catch (error: any) {
            log.error(`Erro: ${error}`);
            throw new CustomError(error.message, 500);
        }
    }

    async validarToken(token: string) {
        try {
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`
                }
            };
            log.info("Executando a /api/login/validar-token");
            let response: boolean = await fetch(`${environments.BACK_END}/login/validar-token`, options).then((res) => res.json());
            return response;
        } catch (error: any) {
            log.error(`Erro: ${error}`);
            throw new CustomError(error.message, 500);
        }
    }

    async cadastrarLogin(cadastroLogin: LoginCadastroDto, token: string) {
        try {
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`
                },
                body: JSON.stringify(cadastroLogin)
            }

            log.info("Executando a /api/login/cadastrar-login");
            const res = await fetch(`${environments.BACK_END}/login/cadastrar-login`, options);
            const status = res.status;
            let retorno: GenericResponseDto = {
                status, message: status === 201 ? 'Cadastro efetuado com sucesso' : 'Erro ao cadastrar o login'
            };
            return retorno;
        } catch (error: any) {
            log.error(`Erro: ${error}`);
            throw new CustomError(error.message, 500);
        }
    }

    async atualizarLogin(atualizacaoLogin: LoginAtualizacaoDto, token: string) {
        try {
            const options = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(atualizacaoLogin)
            }

            log.info("Executando a /api/login/atualizar-login");
            const res = await fetch(`${environments.BACK_END}/login/atualizar-login`, options);
            const status = res.status;
            let retorno: GenericResponseDto = {
                status, message: status === 204 ? 'Login atualizado com sucesso' : 'Erro ao atualizar o login'
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

            log.info("Executando a /api/login/buscar-por-id/{id}");
            const res = await fetch(`${environments.BACK_END}/login/buscar-por-id/${id}`, options);
            const status = res.status;
            let retorno;
            if (status === 204) {
                retorno = {
                    status: 204,
                    message: `Usuário não encontrado`
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

    async buscarPorPagina (page: string, limit: string, token: string) {
        try {
            const options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`
                }
            }

            log.info("Executando a /api/login/listar-todos-por-pagina");
            const res = await fetch(`${environments.BACK_END}/login/listar-todos-por-pagina?limit=${limit}&page=${page}`, options);
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

    async excluirLogin (id: number, token: string) {
        try {
            const options = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`
                }
            }

            log.info("Executando a /api/login/excluir-login");
            const res = await fetch(`${environments.BACK_END}/login/excluir-login/${id}`, options);
            const status = res.status;
            let retorno;
            if (status === 204) {
                retorno = {
                    status: 204,
                    message: `Usuário excluído com sucesso`
                };
            } else {
                retorno = {
                    status,
                    message: `Erro ao excluir o login`
                };
            }
            return retorno;
        } catch (error: any) {
            log.error(`Erro: ${error}`);
            throw new CustomError(error.message, error.status);
        }
    }
}
