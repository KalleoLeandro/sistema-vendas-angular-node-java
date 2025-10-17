import { CustomError } from '@errors/custom/custom-error';
import { LoginDto } from '@models/dto/login-request-dto';
import { LoginResponseDto } from '@models/dto/login-reponse-dto';
import { LoginRequest } from '@models/interfaces/login-request';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Res } from '@nestjs/common';
import { ApiBody, ApiCookieAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginService } from '@services/login/login.service';
import { decriptografia, logger } from '@utils/utils';
import { Request, Response } from 'express';
import { LoginCadastroDto } from '@models/dto/login-cadastro-dto';
import { GenericResponseDto } from '@models/dto/generic-response-dto';
import { environments } from '@environments/environments';
import { LoginAtualizacaoDto } from '@models/dto/login-atualizacao-dto';
import { Logger } from 'winston';

const log:Logger = logger;


@Controller()
export class LoginController {

    constructor(private readonly loginService: LoginService) { }

    @Post('validar-login')
    @ApiBody({
        description: 'Credenciais criptografadas para autenticação',
        required: true,
        type: LoginDto,
    })
    @ApiOperation({ summary: 'Endpoint de autenticação' })
    @ApiResponse({
        status: 200,
        description: 'Login e/ou senha válidos',
        type: LoginResponseDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Bad Request',
        schema: {
            example: { message: 'Erro' },
        },
    })
    @ApiResponse({
        status: 401,
        description: 'Login e/ou senha inválidos',
        schema: {
            example: { message: "Login e/ou senha inválidos" },
        },
    })
    @ApiResponse({
        status: 500,
        description: 'Erro ao validar o login',
        schema: {
            example: { message: "Erro ao validar o login" },
        },
    })
    async validarLogin(@Body() body: LoginDto, @Res() res: Response) {
        const hash: string = body.hash;

        if (!hash) {
            throw new CustomError("Hash inválido ou ausente", 500);
        }

        const decrypted = decriptografia(hash);

        if (!decrypted) {
            throw new CustomError("Falha ao descriptografar o hash", 500);
        }

        const login: LoginRequest = JSON.parse(decrypted);
        log.info("Executando a LoginService.validarLogin")
        const retorno: LoginResponseDto = await this.loginService.validarLogin(login);
        res.cookie('jwt', retorno.token, {
            httpOnly: true,
            sameSite: environments.NODE_ENV === 'production' ? 'none' : 'lax',
            secure: environments.NODE_ENV === 'production',
        });

        return res.status(200).json({
            expiration: retorno.expiration,
            status: retorno.status,
            userName: retorno.userName,
            message: retorno.message
        });
    }

    @Post('validar-token')
    @ApiCookieAuth()
    @ApiOperation({ summary: 'Endpoint de validação de token' })
    @ApiResponse({
        status: 200,
        description: 'Token testado (pode ser true ou false)',
        schema: {
            example: true
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
        description: 'Erro ao validar o token',
        schema: {
            example: { message: "Erro ao validar o token" },
        },
    })
    async validarToken(@Req() req: Request, @Res() res: Response) {
        const token: string = req.cookies['jwt'];
        log.info("Executando a LoginService.validarToken")
        const retorno: boolean = await this.loginService.validarToken(token);
        return res.status(200).json(retorno);
    }

    @Post('cadastrar-login')
    @ApiCookieAuth()
    @ApiBody({
        description: 'Dados do usuário',
        required: true,
        type: LoginCadastroDto,
    })
    @ApiOperation({ summary: 'Endpoint de Cadastro de Login' })
    @ApiResponse({
        status: 200,
        description: 'Cadastro realizado com sucesso',
        schema: {
            example: {}
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
        description: 'Erro ao cadastrar o login',
        schema: {
            example: { message: 'Erro ao cadastrar o login' },
        },
    })
    async cadastrarLogin(@Req() req: Request, @Res() res: Response) {
        const cadastroLogin: LoginCadastroDto = req.body;
        const token: string = req.cookies.jwt;
        const retorno: GenericResponseDto = await this.loginService.cadastrarLogin(cadastroLogin, token);
        return res.status(retorno.status).json({ message: retorno.message });
    }


    @Put('atualizar-login')
    @ApiCookieAuth()
    @ApiBody({
        description: 'Credenciais criptografadas para autenticação',
        required: true,
        type: LoginAtualizacaoDto,
    })
    @ApiOperation({ summary: 'Endpoint de Atualização de Login' })
    @ApiResponse({
        status: 204,
        description: 'Login atualizado com sucesso',
        schema: {
            example: {}
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
        description: 'Erro ao atualizar o login',
        schema: {
            example: { message: 'Erro ao atualizar o login' },
        },
    })
    async atualizarLogin(@Req() req: Request, @Res() res: Response) {
        const atualizacaoLogin: LoginAtualizacaoDto = req.body;
        const token: string = req.cookies.jwt;
        const retorno: GenericResponseDto = await this.loginService.atualizarLogin(atualizacaoLogin, token);
        return res.status(retorno.status).json({ message: retorno.message });
    }


    @Get('buscar-por-id/:id')
    @ApiCookieAuth()
    @ApiOperation({ summary: 'Endpoint de retorno de um login por id' })
    @ApiResponse({
        status: 200,
        description: 'Login localizado pelo id',
        type: LoginCadastroDto,
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
        description: 'Erro ao localizar o o login',
        schema: {
            example: { message: 'Erro ao localizar o login' },
        },
    })
    async buscarPorId(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
        const idBusca: string = id;
        const token: string = req.cookies.jwt;
        const cadastroLogin: any = await this.loginService.buscarPorId(idBusca, token);
        if (cadastroLogin.status === 200) {
            res.status(cadastroLogin.status).json(cadastroLogin.response);
        } else {
            res.status(cadastroLogin.status).json(cadastroLogin.message);
        }
    }

    @Get('buscar-por-pagina')
    @ApiCookieAuth()
    @ApiOperation({ summary: 'Endpoint de retorno de uma lista paginada de logins ' })
    @ApiResponse({
        status: 200,
        description: 'Login localizado pelo id',
        type: [
            LoginCadastroDto
        ],
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
        description: 'Erro ao buscar os logins',
        schema: {
            example: { message: 'Erro ao buscar os logins' },
        },
    })
    async buscarPorPagina(@Query('page') page: string, @Query('limit') limit: string, @Req() req: Request, @Res() res: Response) {
        const token: string = req.cookies.jwt;
        const listaLogins = await this.loginService.buscarPorPagina(page, limit, token);
        return res.status(listaLogins.status).json(listaLogins.response);
    }

    @Delete('excluir-login/:id')
    @ApiCookieAuth()
    @ApiOperation({ summary: 'Endpoint de exclusão de logins ' })
    @ApiResponse({
        status: 204,
        description: 'Login excluido pelo id',
         schema: {
            example: {},
        }        
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
        description: 'Erro ao excluir o logins',
        schema: {
            example: { message: 'Erro ao excluir o logins' },
        },
    })
    async excluirLogin(@Param('id') id: number, req: Request, res: Response) {
        const token: string = req.cookies.jwt;
        const retorno = await this.loginService.excluirLogin(id, token);
        return res.status(retorno.status).json(retorno.message);
    }
}
