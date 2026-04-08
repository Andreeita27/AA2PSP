import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServerDto } from './dto/create-server.dto';
import { UpdateServerDto } from './dto/update-server.dto';

@Injectable()
export class ServersService {
    constructor(private readonly prisma: PrismaService) {}
    //Crear un nuevo servidor (guild)
    async create(createServerDto: CreateServerDto) {
        //Comprobamos que el usuario exista antes de crear el servidor
        const owner = await this.prisma.user.findUnique({
            where: { id: createServerDto.ownerId },
        });

        if (!owner) {
            throw new NotFoundException(
                `No se encontró un usuario con id ${createServerDto.ownerId}`,
            );
        }

        return this.prisma.server.create({
            data: {
                name: createServerDto.name,
                description: createServerDto.description,
                ownerId: createServerDto.ownerId,
            },
            include: {
                owner:{
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        createdAt: true,
                    },
                },
            },
        });
    }

    //Obtener todos los servidores
    async findAll() {
        return this.prisma.server.findMany({
            include: {
                owner:{
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        createdAt: true,
                    },
                },
            },
            orderBy: {
                id: 'asc',
            },
        });
    }

    //Obtener un servidor por su ID
    async findOne(id: number) {
        const server = await this.prisma.server.findUnique({
            where: { id },
            include: {
                owner:{
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        createdAt: true,
                    },
                },
            },
        });

        if (!server) {
            throw new NotFoundException(`No se encontró un servidor con id ${id}`);
        }

        return server;
    }

    //Actualizar un servidor por su ID
    async update(id: number, updateServerDto: UpdateServerDto) {
        await this.findOne(id); // Verificar que el servidor exista antes de actualizar

        //Si llega el ownerId en el body, comprobamos que exista el usuario
        if (updateServerDto.ownerId) {
            const owner = await this.prisma.user.findUnique({
                where: { id: updateServerDto.ownerId },
            });

            if (!owner) {
                throw new NotFoundException(
                    `No se encontró un usuario con id ${updateServerDto.ownerId}`,
                );
            }
        }

        return this.prisma.server.update({
            where: { id },
            data: updateServerDto,
            include: {
                owner:{
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        createdAt: true,
                    },
                },
            },
        });
    }

    //Eliminar un servidor por su ID
    async remove(id: number) {
        await this.findOne(id); // Verificar que el servidor exista antes de eliminar

        return this.prisma.server.delete({
            where: { id },
        });
    }
}
