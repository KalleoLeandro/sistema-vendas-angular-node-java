import { environments } from "@environments/environments";
import { CustomError } from "@errors/customError";
import { logger } from "@utils/utils";
import { Logger } from "winston";

const log: Logger = logger;

export const validarCpf = async (cpf: string, token: string) => {
    try {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: cpf
        }

        log.info("Executando a /api/utils/validar-cpf");
        const res = await fetch(`${environments.BACK_END}/utils/validar-cpf`, options);        
        const response = res.json();
        return response;
    } catch (error: any) {
        log.error(`Erro: ${error}`);
        throw new CustomError(error.message, 500);
    }
}