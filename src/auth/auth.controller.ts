import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse, } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    // POST/auth/register
    @Post('register')
    @ApiOperation({
        summary: 'Registrar un nuevo usuario',
        description: 'Crea un nuevo usuario en la aplicación',
    })
    @ApiBody({
        type: RegisterDto,
        description: 'Datos necesarios para registrar al usuario',
    })
    @ApiCreatedResponse({
        description: 'Usuario registrado correctamente',
    })
    @ApiBadRequestResponse({
        description: 'Los datos enviados no son válidos o el usuario ya existe',
    })
    register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    // POST/auth/login
    //Comprueba credenciales y devuelve JWT
    @Post('login')
    @ApiOperation({
        summary: 'Iniciar sesión',
        description: 'Valida las credenciales del usuario y devuelve un token JWT',
    })
    @ApiBody({
        type: LoginDto,
        description: 'Credenciales necesarias para iniciar sesión',
    })
    @ApiOkResponse({
        description: 'Inicio de sesión exitoso, token JWT devuelto',
    })
    @ApiUnauthorizedResponse({
        description: 'Credenciales incorrectas',
    })
    @ApiBadRequestResponse({
        description: 'Los datos enviados no son válidos',
    })
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }
}
