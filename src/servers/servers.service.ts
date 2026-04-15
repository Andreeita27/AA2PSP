import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServerDto } from './dto/create-server.dto';
import { UpdateServerDto } from './dto/update-server.dto';

@Injectable()
export class ServersService {
    constructor(private readonly prisma: PrismaService) {}
    //Crear un nuevo servidor (guild)
    //El ownerId no llega desde el body, sino desde el usuario autenticado
    async create(createServerDto: CreateServerDto, ownerId: number) {
        //Comprobamos que el usuario exista antes de crear el servidor
        const owner = await this.prisma.user.findUnique({
            where: { id: ownerId },
        });

        if (!owner) {
            throw new NotFoundException(
                `No se encontró un usuario con id ${ownerId}`,
            );
        }

        return this.prisma.server.create({
            data: {
                name: createServerDto.name,
                description: createServerDto.description,
                ownerId,
                members: {
                    create: {
                        userId: ownerId,
                    },
                },
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
                _count: {
                    select: {
                        channels: true,
                        members: true,
                    },
                },
            },
            orderBy: {
                id: 'asc',
            },
        });
    }

    // Obtener solo los servidores a los que pertenece el usuario autenticado
    async findMyServers(userId: number) {
        return this.prisma.server.findMany({
            where: {
                members: {
                    some: {
                        userId,
                    },
                },
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        createdAt: true,
                    },
                },
                _count: {
                    select: {
                        channels: true,
                        members: true,
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
                _count: {
                    select: {
                        channels: true,
                        members: true,
                    },
                },
            },
        });

        if (!server) {
            throw new NotFoundException(`No se encontró un servidor con id ${id}`);
        }

        return server;
    }

    // Unirse a un servidor
    async joinServer(serverId: number, userId: number) {
        const server = await this.prisma.server.findUnique({
            where: { id: serverId },
        });

        if (!server) {
            throw new NotFoundException(`No se encontró un servidor con id ${serverId}`);
        }

        const user = await this.prisma.server.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException(`No se encontró un usuario con id ${userId}`);
        }

        const existingMembership = await this.prisma.serverMember.findUnique({
            where: {
                userId_serverId: {
                    userId,
                    serverId,
                },
            },
        });

        if (existingMembership) {
            throw new BadRequestException(`Ya estás unido a este servidor`);
        }

        return this.prisma.serverMember.create({
            data: {
                userId,
                serverId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                    },
                },
                server: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                    },
                },
            },
        });
    }

    // Salir de un servidor
    async leaveServer(serverId: number, userId: number) {
        const server = await this.prisma.server.findUnique({
            where: { id: serverId },
        });

        if (!server) {
            throw new NotFoundException(`No se encontró un servidor con id ${serverId}`);
        }

        // El owner no puede salir de su propio servidor sin borrarlo
        if (server.ownerId === userId) {
            throw new ForbiddenException(`El propietario no puede salir de su propio servidor`);
        }

        const membership = await this.prisma.serverMember.findUnique({
            where: {
                userId_serverId: {
                    userId,
                    serverId,
                },
            },
        });

        if (!membership) {
            throw new NotFoundException(`No perteneces a este servidor`);
        }

        // Cuando el usuario sale del servidor, se limpia la membresía tambien
        await this.prisma.channelMember.deleteMany({
            where: {
                userId,
                channel: {
                    serverId,
                },
            },
        });

        await this.prisma.serverMember.delete({
            where: {
                userId_serverId: {
                    userId,
                    serverId,
                },
            },
        });

        return {
            message: 'Has salido del servidor correctamente',
        };
    }

    //Actualizar un servidor por su ID
    async update(id: number, updateServerDto: UpdateServerDto) {
        await this.findOne(id); // Verificar que el servidor exista antes de actualizar

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
