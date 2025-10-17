import { LoginCadastro } from "@models/interfaces/login-cadastro";
import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsNotEmpty } from "class-validator";

export class LoginCadastroDto implements LoginCadastro {

    @ApiProperty({ example: 1 })    
    id?: number | undefined;

    @ApiProperty({ example: 'João da Silva' })
    @IsNotEmpty({message: 'O campo nome é obrigatório'})
    nome: string;
    
    @ApiProperty({ example: '222.333.444-05' })    
    @IsNotEmpty({message: 'O campo cpf é obrigatório'})
    cpf: string;

    @ApiProperty({ example: 'teste' })
    @IsNotEmpty({message: 'O campo login é obrigatório'})
    login: string;

    @ApiProperty({ example: 'teste' })
    @IsNotEmpty({message: 'O campo senha é obrigatório'})
    senha: string;

    @ApiProperty({ example: 'user'})
    @IsNotEmpty({message: 'O campo perfil é obrigatório'})
    perfil: string;
    
}