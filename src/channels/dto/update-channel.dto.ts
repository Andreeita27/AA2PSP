import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateChannelDto {
    // Nombre del canal dentro del servidor
    @ApiPropertyOptional({
        example: 'Gaming',
        description: 'Nuevo nombre del canal',
    })
    @IsString({ message: 'El nombre del canal debe ser un texto' })
    @IsOptional()
    name?: string; // el ? indica que puede ser undefined si el usuario no lo envia

    // Tipo del canal
    @ApiPropertyOptional({
        example: 'Voz',
        description: 'Nuevo tipo del canal',
    })
    @IsString({ message: 'El tipo del canal debe ser un texto' })
    @IsOptional()
    type?: string;
}
// Pongo todos los campos opcionales porque el usuario puede modificar solo una parte de la informacion