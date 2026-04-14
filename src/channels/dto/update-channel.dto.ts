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
    name?: string;

    // Tipo del canal
    @ApiPropertyOptional({
        example: 'Voz',
        description: 'Nuevo tipo del canal',
    })
    @IsString({ message: 'El tipo del canal debe ser un texto' })
    @IsOptional()
    type?: string;
}