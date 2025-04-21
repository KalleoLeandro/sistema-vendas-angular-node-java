import { Request, Response, NextFunction } from 'express';
import { validarToken } from '@services/loginService';


export const verificaTokenValido = async (req: Request, res: Response, next:NextFunction) => {    
    const token: string = req.headers.authorization as string;     
    try{
        const retorno: boolean = await validarToken(token);
        if(retorno){
            next();
        } else {
            res.status(401).end();
        }
    }
    catch (e) {
        res.status(500).end();
    }    
}