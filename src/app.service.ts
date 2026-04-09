// La lógica usada por el controller
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {

  constructor(private prisma: PrismaService) {}

  async getHello(): Promise<string> {
    const users = await this.prisma.user.findMany();
    return `Usuarios en BD: ${users.length}`;
  }
}
