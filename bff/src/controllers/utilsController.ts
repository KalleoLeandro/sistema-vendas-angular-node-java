import { GenericResponse } from "@models/genericResponse";
import { logger } from "@utils/utils";
import { Request, Response } from "express";
import { Logger } from "winston";
import * as utilsService from "@services/utilsService";

const log: Logger = logger;

export const validarCpf = async (req: Request, res: Response) => {
    try {
        const cpf: string = req.body.cpf;
        const token: string = req.headers.authorization as string;
        const retorno:any = await utilsService.validarCpf(cpf, token);
        res.status(200).json({valido: retorno.valido});
    } catch (error) {
        log.error(`Erro: ${error}`);
        res.status(500).json({ message: "Erro ao validar o cpf" });
    }
}