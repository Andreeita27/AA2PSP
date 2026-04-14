import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    //Nombre de usuaario visible dentro de la aplicación
    @ApiProperty({
        example: 'Andreita',
        description: 'Nombre de usuario que se muestra en la aplicación',
    })
    @IsString({ message: 'El nombre de usuario debe ser un texto' })
    @IsNotEmpty({ message: 'El nombre de usuario es obligatorio' })
    username!: string;

    //Email del usuario que se usa para el loggin
    @ApiProperty({
        example: 'andrea@ejemplo.com',
        description: 'Email del usuario para iniciar sesión',
    })
    @IsEmail({}, { message: 'El email debe tener un formato válido' })
    @IsNotEmpty({ message: 'El email es obligatorio' })
    email!: string;

    //Constraseña en texto plano que luego cifro con bcrypt
    @ApiProperty({
        example: '123456',
        description: 'Contraseña del usuario, después será cifrada',
        minLength: 6,
    })
    @IsString({ message: 'La contraseña debe ser un texto' })
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    password!: string;
}