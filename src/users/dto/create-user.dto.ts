import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({
        example: 'Andreita',
        description: 'Nombre de usuario visible en la plataforma',
    })
    //Nombre visible del usuario dentor de la plataforma
    @IsString({ message:'El nombre de usuario debe ser un texto' })
    @IsNotEmpty({ message: 'El nombre de usuario es obligatorio' })
    username!: string;

    //Email del usuario, se valida que tenga formato correcto
    @ApiProperty({
        example: 'andreita@ejemplo.com',
        description: 'Email del usuario',
    })
    @IsEmail({}, {message: ' El email debe tener un formato válido' })
    @IsNotEmpty({ message: 'El email es obligatorio' })
    email!: string;

    //Contraseña del usuario
    @ApiProperty({
        example: '123456',
        description: 'Contraseña del usuario',
        minLength: 6,
    })
    @IsString({ message: 'La contraseña debe ser un texto' })
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    password!: string;
}
// El ! le dice a TypeScript que la propiedad va a tener valor aunque no se inicialice en el constrcutor