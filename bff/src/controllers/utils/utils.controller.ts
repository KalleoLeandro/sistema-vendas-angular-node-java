import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { ApiBody, ApiCookieAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UtilsService } from '@services/utils/utils.service';
import { logger } from '@utils/utils';
import { Request, Response } from 'express';

const log = logger;

@Controller()
export class UtilsController {

    constructor(private readonly utilsService: UtilsService) { }

    @Post('validar-cpf')
    @ApiCookieAuth()
    @ApiBody({
        description: 'Cpf a ser validado',
        required: true,
        schema: {
            example: {
                cpf: '222.333.444-05'
            }
        }
    })
    @ApiOperation({ summary: 'Endpoint de validação de cpf' })
    @ApiResponse({
        status: 200,
        description: 'Resultado de validado do cpf(true) ou false',
        schema: {
            example: { valido: true }
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Bad Request',
        schema: {
            example: { message: 'Erro' },
        },
    })
    @ApiResponse({
        status: 500,
        description: 'Erro ao validar o cpf',
        schema: {
            example: { message: 'Erro ao validar o cpf' },
        },
    })
    async validarCpf(@Body() body: any, @Req() req: Request, @Res() res: Response) {
        const cpf: string = body.cpf;
        const token: string = req.cookies.jwt;
        const retorno: any = await this.utilsService.validarCpf(cpf, token);
        res.status(200).json({ valido: retorno.valido });

    }
}
