import { Request, Response } from "express";
import { decriptografia, logger } from "@utils/utils";
import * as loginService from "@services/loginService";
import { LoginRequest } from "@models/loginRequest";
import { LoginResponse } from "@models/loginReponse";

const log = logger;

export const validarLogin = async (req: Request, res: Response) => {
    try {
        const login: LoginRequest = JSON.parse(decriptografia(req.body.hash));
        log.info("Executando a LoginService.validarLogin")     
        const retorno: LoginResponse = await loginService.validarLogin(login);
        if (retorno.status === 200 && retorno.token) {
            res.cookie("token", retorno.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: Number(retorno.expiration) || 3600000,
            });
            res.status(200).json({expiration: retorno.expiration,
                status: retorno.status,                
                message: retorno.message
            });
        } else {
            res.status(retorno.status).json({message: retorno.message});
        }
    } catch (error) {
        log.error(`Erro: ${error}`);
        res.status(500).json(`${error}`);
    }
}

export const validarToken = async (req:Request, res: Response) =>{
    try{
        const token: string = req.cookies?.token;
        log.info("Executando a LoginService.validarToken")
        const retorno: any = await loginService.validarToken(token);        
        res.status(200).json(retorno);
    }catch(error){
        log.error(`Erro ao validar o token`);
        res.status(500).json(`${error}`);
    }
}