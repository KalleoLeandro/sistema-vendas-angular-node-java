import { environments } from "@environments/environments";
import { CustomError } from "@errors/customError";
import { LoginCadastroDados } from "@models/cadastroLogin";
import { GenericResponse } from "@models/genericResponse";
import { LoginResponse } from "@models/loginReponse";
import { LoginRequest } from "@models/loginRequest";
import { logger } from "@utils/utils";

const log = logger;

export const validarLogin = async (body: LoginRequest) => {
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
        const response: LoginResponse = await res.json();
        let retorno: LoginResponse;

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

export const validarToken = async (token: string) => {
    try {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
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

export const cadastrarLogin = async (cadastroLogin: LoginCadastroDados, token: string) => {
    try {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(cadastroLogin)
        }

        log.info("Executando a /api/login/cadastrar-login");
        const res = await fetch(`${environments.BACK_END}/login/cadastrar-login`, options);
        const status = res.status;
        let retorno: GenericResponse = {
             status, message:  status === 201 ? 'Cadastro efetuado com sucesso' : 'Erro ao cadastrar o login'
        };
        return retorno;
    } catch (error: any) {
        log.error(`Erro: ${error}`);
        throw new CustomError(error.message, 500);
    }
}

export const atualizarLogin = async (cadastroLogin: LoginCadastroDados, token: string) => {
    try {
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(cadastroLogin)
        }

        log.info("Executando a /api/login/atualizar-login");
        const res = await fetch(`${environments.BACK_END}/login/atualizar-login`, options);
        const status = res.status;
        let retorno: GenericResponse = {
             status, message:  status === 204 ? 'Cadastro atualizado com sucesso' : 'Erro ao atualizar o login'
        };
        return retorno;
    } catch (error: any) {
        log.error(`Erro: ${error}`);
        throw new CustomError(error.message, 500);
    }
}
