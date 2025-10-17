import { GenericResponse } from "@models/interfaces/generic";
import { ApiProperty } from "@nestjs/swagger";

export class GenericResponseDto implements GenericResponse {
    
    @ApiProperty({ example: 200 })    
    status: number;

    @ApiProperty({ example: 'Cadastro concluído com sucesso!' })        
    message: string;
    
}