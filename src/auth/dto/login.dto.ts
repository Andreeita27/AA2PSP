import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
    //Email con el que el usuario inicia sesión
    @IsEmail({}, { message: 'El email debe tener un formato válido' })
    @IsNotEmpty({ message: 'El email es obligatorio' })
    email!: string;

    //Contraseña del usuario
    @IsString({ message: 'La contraseña debe ser un texto' })
    @IsNotEmpty({ message: 'La contraseña es obligatoria' })
    password!: string;
}