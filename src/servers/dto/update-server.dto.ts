import { IsOptional, IsString, } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateServerDto {
    //Nuevo nombre del servidor
    @ApiPropertyOptional({
        example: 'Servidor gaming',
        description: 'Nuevo nombre del servidor',
    })
    @IsString({ message: 'El nombre debe ser un texto' })
    @IsOptional()
    name?: string;

    //Nueva descripción del servidor
    @ApiPropertyOptional({
        example: 'Servidor para charlar sobre videojuegos',
        description: 'Nueva descripción del servidor',
    })
    @IsString({ message: 'La descripción debe ser un texto' })
    @IsOptional()
    description?: string;
}