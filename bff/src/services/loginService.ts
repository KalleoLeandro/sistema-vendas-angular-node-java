import { LoginResponse } from "@models/loginReponse";
import { LoginRequest } from "@models/loginRequest";
import { environments } from "environments/environments";
import { CustomError } from "errors/customError";
import { logger } from "utils/utils";

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
        let response:LoginResponse = await fetch(`${environments.BACK_END}/login/validar-login`, options).then((res) => res.json());
        const statusCode = response.status;
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

export const validarToken = async(token:any)=>{
    try {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }            
        };
        log.info("Executando a /api/login/validar-token");
        let response:boolean = await fetch(`${environments.BACK_END}/login/validar-token`, options).then((res) => res.json());        
        return response;
    }catch (error: any) {
        log.error(`Erro: ${error}`);
        throw new CustomError(error.message, 500);
    }
}