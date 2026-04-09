import { IsOptional, IsString, } from "class-validator";

export class UpdateServerDto {
    //Nuevo nombre del servidor
    @IsString({ message: 'El nombre debe ser un texto' })
    @IsOptional()
    name?: string;

    //Nueva descripción del servidor
    @IsString({ message: 'La descripción debe ser un texto' })
    @IsOptional()
    description?: string;
}