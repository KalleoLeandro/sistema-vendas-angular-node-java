import { Request, response, Response } from "express";
import { decriptografia, logger } from "@utils/utils";
import * as loginService from "@services/loginService";
import { LoginRequest } from "@models/loginRequest";
import { LoginResponse } from "@models/loginReponse";
import { CustomError } from "@errors/customError";
import { LoginCadastroDados } from "@models/cadastroLogin";
import { GenericResponse } from "@models/genericResponse";

const log = logger;

export const validarLogin = async (req: Request, res: Response) => {
    try {
        const hash: string = req.body.hash;

        if (!hash) {
            throw new CustomError("Hash inválido ou ausente", 500);
        }

        const decrypted = decriptografia(hash);

        if (!decrypted) {
            throw new CustomError("Falha ao descriptografar o hash", 500);
        }

        const login: LoginRequest = JSON.parse(decrypted);
        log.info("Executando a LoginService.validarLogin")
        const retorno: LoginResponse = await loginService.validarLogin(login);
        if (retorno.status === 200 && retorno.token) {
            res.status(200).json({
                token: retorno.token,
                userName: retorno.userName,
                expiration: retorno.expiration,
                status: retorno.status,
                message: retorno.message
            });
        } else {
            res.status(retorno.status).json({ message: retorno.message });
        }
    } catch (error) {
        log.error(`Erro: ${error}`);
        res.status(500).json({message: `Erro ao validar o login`});
    }
}

export const validarToken = async (req: Request, res: Response) => {
    try {
        const token: string = req.headers.authorization as string;
        log.info("Executando a LoginService.validarToken")
        const retorno: boolean = await loginService.validarToken(token);
        res.status(200).json(retorno);
    } catch (error) {
        log.error(`Erro: ${error}`);
        res.status(500).json({message: `Erro ao validar o token`});
    }
}

export const cadastrarLogin = async (req: Request, res: Response) => {
    try {
        const cadastroLogin: LoginCadastroDados = req.body;
        const token: string = req.headers.authorization as string;        
        const retorno: GenericResponse = await loginService.cadastrarLogin(cadastroLogin, token);
        res.status(retorno.status).json({ message: retorno.message });
    } catch (error) {
        log.error(`Erro: ${error}`);
        res.status(500).json({message: "Erro ao cadastrar o login"});
    }
}

export const atualizarLogin = async (req: Request, res: Response) => {
    try {
        const cadastroLogin: LoginCadastroDados = req.body;
        const token: string = req.headers.authorization as string;        
        const retorno: GenericResponse = await loginService.atualizarLogin(cadastroLogin, token);
        res.status(retorno.status).json({ message: retorno.message });
    } catch (error) {
        log.error(`Erro: ${error}`);
        res.status(500).json({message: "Erro ao atualizar o login"});
    }
}

export const buscarPorId = async(req:Request, res:Response) =>{
    try {
        const id: string = req.params.id;
        const token: string = req.headers.authorization as string;        
        const cadastroLogin = await loginService.buscarPorId(id, token);
        if(cadastroLogin.status === 200){            
            res.status(cadastroLogin.status).json(cadastroLogin.response);
        } else {            
            res.status(cadastroLogin.status).json(cadastroLogin.message);
        }
        
    } catch (error:any) {
        log.error(`Erro: ${error}`);
        res.status(500).json({message: "Erro ao atualizar o login"});
    }
}
