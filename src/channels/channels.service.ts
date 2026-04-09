import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';

@Injectable()
export class ChannelsService {
    constructor(private readonly prisma: PrismaService) {}
    //Crear un nuevo canal en un servidor concreto
    // El serverId llega en la URL
    async create(createChannelDto: CreateChannelDto, serverId: number) {
        // Comprobamos que el servidor exista
        const server = await this.prisma.server.findUnique({
            where: { id: serverId },
        });

        if (!server) {
            throw new NotFoundException(`Servidor con ID ${serverId} no encontrado`);
        }

        return this.prisma.channel.create({
            data: {
                name: createChannelDto.name,
                type: createChannelDto.type || 'TEXT',
                serverId,
            },
            include: {
                server: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        ownerId: true,
                        createdAt: true,
                    },
                },
            },
        });
    }

    //Obtener todos los canales de todos los servidores
    async findAll() {
        return this.prisma.channel.findMany({
            include: {
                server: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        ownerId: true,
                        createdAt: true,
                    },
                },
            },
            orderBy: {
                id: 'asc',
            },
        });
    }

    //Obtener todos los canales de un servidor concreto
    async findByServer(serverId: number) {
        // Comprobamos que el servidor exista
        const server = await this.prisma.server.findUnique({
            where: { id: serverId },
        });

        if (!server) {
            throw new NotFoundException(`Servidor con ID ${serverId} no encontrado`);
        }

        return this.prisma.channel.findMany({
            where: { serverId },
            include: {
                server: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        ownerId: true,
                        createdAt: true,
                    },
                },
            },
            orderBy: {
                id: 'asc',
            },
        });
    }


    //Obtener un canal concreto por su ID
    async findOne(id: number) {
        const channel = await this.prisma.channel.findUnique({
            where: { id },
            include: {
                server: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        ownerId: true,
                        createdAt: true,
                    },
                },
            },
        });

        if (!channel) {
            throw new NotFoundException(`Canal con ID ${id} no encontrado`);
        }

        return channel;
    }

    //Actualizar un canal concreto por su ID
    async update(id: number, updateChannelDto: UpdateChannelDto) {
        // Comprobamos que el canal exista
        const channel = await this.prisma.channel.findUnique({
            where: { id },
        });

        if (!channel) {
            throw new NotFoundException(`Canal con ID ${id} no encontrado`);
        }

        return this.prisma.channel.update({
            where: { id },
            data: updateChannelDto,
            include: {
                server: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        ownerId: true,
                        createdAt: true,
                    },
                },
            },
        });
    }

    //Eliminar un canal por su ID
    async remove(id: number) {
        await this.findOne(id); // Verificamos que el canal existe antes de eliminarlo

        await this.prisma.channel.delete({
            where: { id },
        });
    }
}