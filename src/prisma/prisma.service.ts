import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

// Servicio encargado de gestionar la conexion con la bd
// Extiende de PrimaClient para poder utilizar automaticamente todos los metodos generados automaticamente con Prisma
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      // Configurador del adaptador PostgreSQL
      // PrismaPg permite conectar Prisma con PostgreSQL usando DATABSE_URL
      adapter: new PrismaPg({
        // Lee la URL de conexion desde el archivo .env
        connectionString: process.env.DATABASE_URL!, // ! = el valor existira
      }),
    });
  }
  
  // Este método se ejecuta cuando nest arranca
  async onModuleInit() {
    await this.$connect();
  }
}
