import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Teste')
@Controller('teste')
export class TesteController {

  @Get()
  @ApiOperation({ summary: 'Teste de endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Retorna uma mensagem de sucesso',
    schema: {
      example: { message: 'Teste Ok' },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    schema: {
      example: { message: 'Erro' },
    },
  })
  teste() {
    return { message: 'Teste Ok' };
  }
}
