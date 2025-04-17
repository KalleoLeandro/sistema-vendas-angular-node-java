import { Request, Response } from "express";
import { decriptografia, logger } from "@utils/utils";
import * as loginService from "@services/loginService";
import { LoginRequest } from "@models/loginRequest";

const log = logger;

export const validarLogin = async (req: Request, res: Response) => {
    try {
        const login: LoginRequest = JSON.parse(decriptografia(req.body.hash));
        log.info("Executando a LoginService.validarLogin")     
        const retorno: any = await loginService.validarLogin(login);
        if (retorno.status === 200) {
            res.status(retorno.status).json(retorno);
        } else {
            res.status(retorno.status).json(retorno.mensagem);
        }
    } catch (error) {
        log.error(`Erro: ${error}`);
        res.status(500).json(`Erro: ${error}`);
    }
}

export const validarToken = async (req:Request, res: Response) =>{
    try{
        const body:any = req.headers.authorization;        
        log.info("Executando a LoginService.validarToken")
        const retorno: any = await loginService.validarToken(body);        
        res.status(200).json(retorno);
    }catch(error){
        log.error(`Erro ao validar o token`);
        res.status(500).json(`Erro: ${error}`);
    }
}