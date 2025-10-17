import { environments } from '@environments/environments';
import { CustomError } from '@errors/custom/custom-error';
import { Injectable } from '@nestjs/common';
import { logger } from '@utils/utils';
import { Logger } from 'winston';

const log: Logger = logger;

@Injectable()
export class UtilsService {

    async validarCpf(cpf: string, token: string) {
        try {
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`
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

}
