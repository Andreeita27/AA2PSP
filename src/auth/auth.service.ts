import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService, // para acceder a la bd
        private readonly jwtService: JwtService, // para generar tokens
    ) {}

    // Registro de un nuevo usuario
    async register(registerDto: RegisterDto) {
        const { username, email, password } = registerDto; //extrae los datos recibidos desde el dto de registro

        //Compruebo si ya existe un usuario con ese email
        const existingUserByEmail = await this.prisma.user.findUnique({
            where: { email },
        });

        if (existingUserByEmail) {
            throw new BadRequestException('Ya existe un usuario con ese email'); // si existe -> error
        }

        //Compruebo si ya existe un usuario con ese nombre de usuario
        const existingUserByUsername = await this.prisma.user.findUnique({
            where: { username },
        });

        if (existingUserByUsername) {
            throw new BadRequestException('Ya existe un usuario con ese nombre de usuario'); // si existe -> error
        }

        //Cifro la contraseña antes de guardarla en la bd
        const hashedPassword = await bcrypt.hash(password, 10); // el 10 son las rondas de salt de bcrypt

        //Creo el usuario en la bd
        const user = await this.prisma.user.create({
            data: { username, email, password: hashedPassword, } // la contraseña se guarda una vez hasheada
        });

        //Devuelvo el usuario sin exponer la contraseña
        return {
            message: 'Usuario registrado correctamente',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt,
            },
        };
    }

    //comprueba que el usuario exista y que la contraseña sea correcta
    // se usa durant el login antes de generar el jwt
    async validateUser(loginDto: LoginDto) {
        const { email, password } = loginDto;
        //Buscoamos el usuario por email
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new UnauthorizedException('Credenciales incorrectas'); // si no existe -> error
        }

        //Comparamos la contraseña enviada con la contraseña cifrada de la bd
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Credenciales incorrectas'); // si no coincide -> error
        }

        return user; // si todo guay, devolvemos el usuario encontrado
    }

    //Login del usuario y generacion del token JWT
    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto); // valida que el usuario exista y que la contraseña sea correcta
        //Payload: información minima que irá dentro del token
        const payload = {
            sub: user.id, // sub se suele usar para guardar el identificador principal del usuario
            email: user.email,
            username: user.username,
        };

        // Si las credenciales son correctas, devolvemos un token firmado
        return {
            message: 'Login correcto',
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}
