import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

// esta estrategia define como se valida un jwt dentro de la app
// Passport se encarga de ejecutarla automaticamente cuando una ruta este protegida
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    // Inyectamos configService para poder leer las variables del archivo .env
    constructor(private readonly configService: ConfigService) {
        //Leemos la clave JWT del archivo .env
        const jwtSecret = configService.get<string>('JWT_SECRET');

        //Ademas Typescript ya sabe que aqui siempre habra un string
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // indica que el token se obtiene del header
            ignoreExpiration: false, // si esta expirado, rechaza
            secretOrKey: jwtSecret || 'secreto_super_seguro', //Si no existe, usamos una cadena por defecto para evitar que falle la estrategia
        })
    }

    // Este metodo se ejecuta automaticamente cuando el token es valido
    //El payload contiene la info guardadaa dentro del jwt
    //Lo que se devuelve aqui se asigna a request.user
    async validate(payload: any) {
        return {
            userId: payload.sub,
            email: payload.email,
            username: payload.username,
        };
    }
}