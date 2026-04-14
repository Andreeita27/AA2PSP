import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateServerDto {
    // Nombre del servidor (guild) que verán los usuarios
    @ApiProperty({
        example: 'Servidor general',
        description: 'Nombre del servidor que se va a crear',
    })
    @IsString({ message: 'El nombre debe ser un texto' })
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    name!: string;

    //Descripcion opcional del servidor
    @ApiPropertyOptional({
        example: 'Servidor general para charlar sobre cualquier tema',
        description: 'Descripción opcional del servidor',
    })
    @IsString({ message: 'La descripción debe ser un texto' })
    @IsOptional()
    description?: string;
}