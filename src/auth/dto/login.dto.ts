import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    //Email con el que el usuario inicia sesión
    @ApiProperty({
        example: 'andrea@ejemplo.com',
        description: 'Email del usuario para iniciar sesión',
    })
    @IsEmail({}, { message: 'El email debe tener un formato válido' })
    @IsNotEmpty({ message: 'El email es obligatorio' })
    email!: string;

    //Contraseña del usuario
    @ApiProperty({
        example: '123456',
        description: 'Contraseña del usuario para iniciar sesión',
    })
    @IsString({ message: 'La contraseña debe ser un texto' })
    @IsNotEmpty({ message: 'La contraseña es obligatoria' })
    password!: string;
}