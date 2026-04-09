import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) {}

    // Registro de un nuevo usuario
    async register(registerDto: RegisterDto) {
        const { username, email, password } = registerDto;

        //Compruebo si ya existe un usuario con ese email
        const existingUserByEmail = await this.prisma.user.findUnique({
            where: { email },
        });

        if (existingUserByEmail) {
            throw new BadRequestException('Ya existe un usuario con ese email');
        }

        //Compruebo si ya existe un usuario con ese nombre de usuario
        const existingUserByUsername = await this.prisma.user.findUnique({
            where: { username },
        });

        if (existingUserByUsername) {
            throw new BadRequestException('Ya existe un usuario con ese nombre de usuario');
        }

        //Cifro la contraseña antes de guardarla en la bd
        const hashedPassword = await bcrypt.hash(password, 10);

        //Creo el usuario en la bd
        const user = await this.prisma.user.create({
            data: { username, email, password: hashedPassword, }
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

    //Validación del usuario durante el loggin
    async validateUser(loginDto: LoginDto) {
        const { email, password } = loginDto;
        //Buscoamos el usuario por email
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new UnauthorizedException('Credenciales incorrectas');
        }

        //Comparamos la contraseña enviada con la contraseña cifrada de la bd
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Credenciales incorrectas');
        }

        return user;
    }

    //Loggin del usuario y generacion del token JWT
    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto);
        //Payload: información minima que irá dentro del token
        const payload = {
            sub: user.id,
            email: user.email,
            username: user.username,
        };

        return {
            message: 'Login correcto',
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}
