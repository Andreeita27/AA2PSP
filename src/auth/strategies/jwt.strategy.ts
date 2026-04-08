import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            //Extrae el token del header Authorization: Bearer <token>
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'secreto_super_seguro',
        });
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