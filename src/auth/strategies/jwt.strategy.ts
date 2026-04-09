import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService) {
        //Leemos la clave JWT del archivo .env
        const jwtSecret = configService.get<string>('JWT_SECRET');

        //Si no existe, usamos una cadena por defecto para evitar que falle la estrategia
        //Ademas Typescript ya sabe que aqui siempre habra un string
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtSecret || 'secreto_super_seguro',
        })
    }

    //Lo que se devuelve aqui se asigna a request.user
    async validate(payload: any) {
        return {
            userId: payload.sub,
            email: payload.email,
            username: payload.username,
        };
    }
}