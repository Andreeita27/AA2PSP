import { IsOptional, IsString } from 'class-validator';

export class UpdateChannelDto {
    // Nombre del canal dentro del servidor
    @IsString({ message: 'El nombre del canal debe ser un texto' })
    @IsOptional()
    name?: string;

    // Tipo del canal
    @IsString({ message: 'El tipo del canal debe ser un texto' })
    @IsOptional()
    type?: string;
}