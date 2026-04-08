import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateServerDto {
    // Nombre del servidor (guild) que verán los usuarios
    @IsString({ message: 'El nombre debe ser un texto' })
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    name!: string;

    //Descripcion opcional del servidor
    @IsString({ message: 'La descripción debe ser un texto' })
    @IsOptional()
    description?: string;
}