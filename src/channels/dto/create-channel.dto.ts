import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateChannelDto {
    // Nombre del canal dentro del servidor
    @ApiProperty({
        example: 'General',
        description: 'Nombre del canal que se va a crear',
    })
    @IsString({ message: 'El nombre del canal debe ser un texto' })
    @IsNotEmpty({ message: 'El nombre del canal es obligatorio' })
    name!: string;

    // Tipo del canal
    @ApiPropertyOptional({
        example: 'Texto',
        description: 'Tipo del canal (por ejemplo, Texto, Voz, etc.)',
    })
    @IsString({ message: 'El tipo del canal debe ser un texto' })
    @IsOptional()
    type?: string;
}