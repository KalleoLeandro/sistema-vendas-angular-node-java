import { ProdutoRequest } from "@models/interfaces/produto-request";
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class ProdutoCadastroDto implements ProdutoRequest {

  id?: number | undefined;

  @ApiProperty({
    example: 'Arroz',
    description: 'Nome do produto',
    required: true,
  })
  @IsString({ message: 'O campo produto deve ser uma string válida' })
  nome: string;

  @ApiProperty({
    example: 10.50,
    description: 'Preçõ de custo do produto',
    required: true,
  })
  @IsNumber({}, { message: 'O campo precoCusto deve ser um número válido' })
  precoCusto: number;

  @ApiProperty({
    example: 15.00,
    description: 'Preço de venda do produto',
    required: true,
  })
  @IsNumber({}, { message: 'O campo precoVenda deve ser um número válido' })
  precoVenda: number;

  @ApiProperty({
    example: 'Arroz',
    description: 'Nome do produto',
    required: true,
  })
  @IsNumber({}, { message: 'O campo quantidade deve ser um número válido' })
  quantidade: number;

  @ApiProperty({
    example: 1,
    description: 'Tipo de medida',
    required: true,
  })
  @IsNumber({}, { message: 'O campo medida deve ser um número válido' })
  medida: number;

  @ApiProperty({
    example: 1,
    description: 'Tipo de categoria',
    required: true,
  })
  @IsNumber({}, { message: 'O campo categoria deve ser um número válido' })
  categoria: number;

}