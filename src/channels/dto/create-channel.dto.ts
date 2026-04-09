import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateChannelDto {
    // Nombre del canal dentro del servidor
    @IsString({ message: 'El nombre del canal debe ser un texto' })
    @IsNotEmpty({ message: 'El nombre del canal es obligatorio' })
    name!: string;

    // Tipo del canal
    @IsString({ message: 'El tipo del canal debe ser un texto' })
    @IsOptional()
    type?: string;
}