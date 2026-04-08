import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    // Inyectamos PrismaService para poder acceder a la base de datos
    constructor(private readonly prisma: PrismaService) {}

    // Crear un nuevo usuario
    async create(CreateUserDto: CreateUserDto){
        return this.prisma.user.create({
            data: CreateUserDto,
        })
    }

    // Obtener todos los usuarios
    async findAll() {
        return this.prisma.user.findMany({
            orderBy: {
                id: 'asc',
            }
        })

    }

    // Obtener un usuario por id
    async findOne(id: number) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            throw new NotFoundException(`No existe un usuario con id ${id}`);
        }

        return user;
    }

    //Actualizar un usuario por id
    async update(id: number, updateUserDto: UpdateUserDto) {
        await this.findOne(id);

        return this.prisma.user.update({
            where: { id },
            data: updateUserDto,
        });
    }

    // Eliminar un usuario por id
    async remove(id: number) {
        await this.findOne(id);

        return this.prisma.user.delete({
            where: { id },
        });
    }
}
