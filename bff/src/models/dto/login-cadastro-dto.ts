import { LoginCadastro } from "@models/interfaces/login-cadastro";
import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsNotEmpty, IsString } from "class-validator";

export class LoginCadastroDto implements LoginCadastro {

    @ApiProperty({ example: 1 })
    id?: number | undefined;

    @ApiProperty({ example: 'João da Silva' })
    @IsNotEmpty({ message: 'O campo nome é obrigatório' })
    @IsString({ message: 'O campo nome deve ser uma string válida' })
    nome: string;

    @ApiProperty({ example: '222.333.444-05' })
    @IsNotEmpty({ message: 'O campo cpf é obrigatório' })
    @IsString({ message: 'O campo cpf deve ser uma string válida' })
    cpf: string;

    @ApiProperty({ example: 'teste' })
    @IsNotEmpty({ message: 'O campo login é obrigatório' })
    @IsString({ message: 'O campo login deve ser uma string válida' })
    login: string;

    @ApiProperty({ example: 'teste' })
    @IsNotEmpty({ message: 'O campo senha é obrigatório' })
    @IsString({ message: 'O campo senha deve ser uma string válida' })
    senha: string;

    @ApiProperty({ example: 'user' })
    @IsNotEmpty({ message: 'O campo perfil é obrigatório' })
    @IsString({ message: 'O campo perfil deve ser uma string válida' })
    perfil: string;

}