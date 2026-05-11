import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ // Importamos PrismaModule para que AuthService pueda acceder a PrismaService y consultar/crear usuarios en la bd
    PrismaModule,
    ConfigModule, //Permite leer variables de entorno desde el .env
    //RegisterAsync permite leer la configuración del .env de forma segura cuando Nest ya ha cargado ConfigModule
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService], // lo inyectamos para poder leer el .env
      useFactory: async (configService: ConfigService) => ({
        //clave usada para firmar los tokens, si no encuentra jwt secret, utiliza la otra clave por defecto
        secret: configService.get<string>('JWT_SECRET') || 'secreto_super_seguro',
        signOptions: { expiresIn: '1h' }, // tiempo de validez
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
  exports:  [AuthService, JwtStrategy, JwtAuthGuard], // los exportamos para que otros modulos puedan reutilizarlos
})
export class AuthModule {}
