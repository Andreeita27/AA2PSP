import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Este guard se encarga de proteger rutas utilziando jwt
// cuando el usuairo intente acceder a un endpoint protegido, nestjs comprobara automaticamente si el token es valido
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {} // utiliza la estrategia jwt definida en strategies