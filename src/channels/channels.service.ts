import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';

@Injectable()
export class ChannelsService {
    constructor(private readonly prisma: PrismaService) {}
    //Crear un nuevo canal en un servidor concreto
    // El serverId llega en la URL
    // El usuario que lo crea tiene que pertenecer al servidor y se mete automáticamente como miembro del canal
    async create(createChannelDto: CreateChannelDto, serverId: number, userId: number) {
        // Comprobamos que el servidor exista
        const server = await this.prisma.server.findUnique({
            where: { id: serverId },
        });

        if (!server) {
            throw new NotFoundException(`Servidor con ID ${serverId} no encontrado`);
        }

        const serverMembership = await this.prisma.serverMember.findUnique({
            where: {
                userId_serverId: {
                    userId,
                    serverId,
                },
            },
        });

        if (!serverMembership) {
            throw new ForbiddenException(`Debes unirte al servidor antes de crear canales en él`);
        }

        return this.prisma.channel.create({
            data: {
                name: createChannelDto.name,
                type: createChannelDto.type || 'TEXT',
                serverId,
                members: {
                    create: {
                        userId,
                    },
                },
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
                _count: {
                    select: {
                        messages: true,
                        members: true,
                    },
                },
            },
            orderBy: {
                id: 'asc',
            },
        });
    }

    // Obtener los canales a los que está unido el usuario autenticado
    async findMyChannels(userId: number) {
        return this.prisma.channel.findMany({
            where: {
                members: {
                    some: {
                        userId,
                    },
                },
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
                _count: {
                    select: {
                        messages: true,
                        members: true,
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
                _count: {
                    select: {
                        messages: true,
                        members: true,
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
                _count: {
                    select: {
                        messages: true,
                        members: true,
                    },
                },
            },
        });

        if (!channel) {
            throw new NotFoundException(`Canal con ID ${id} no encontrado`);
        }

        return channel;
    }

    // Unirse a un canal
    //Primero hay que pertenecer a su servidor
    async joinChannel(channelId: number, userId: number) {
        const channel = await this.prisma.channel.findUnique({
            where: { id: channelId },
        });

        if (!channel) {
            throw new NotFoundException(`Canal con ID ${channelId} no encontrado`);
        }

        const serverMembership = await this.prisma.serverMember.findUnique({
            where: {
                userId_serverId: {
                    userId,
                    serverId: channel.serverId,
                },
            },
        });

        if (!serverMembership) {
            throw new ForbiddenException(`No puedes unirte a un canal de un servidor al que no perteneces`);
        }

        const existingMembership = await this.prisma.channelMember.findUnique({
            where: {
                userId_channelId: {
                    userId,
                    channelId,
                },
            },
        });

        if (existingMembership) {
            throw new BadRequestException(`Ya estás unido a este canal`);
        }

        return this.prisma.channelMember.create({
            data: {
                userId,
                channelId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                    },
                },
                channel:  {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                        serverId: true,
                    },
                },
            },
        });
    }

    // Salir de un canal
    async leaveChannel(channelId: number, userId: number) {
        const channel = await this.prisma.channel.findUnique({
            where: { id: channelId },
        });

        if (!channel) {
            throw new NotFoundException(`Canal con ID ${channelId} no encontrado`);
        }

        const membership = await this.prisma.channelMember.findUnique({
            where: {
                userId_channelId: {
                    userId,
                    channelId,
                },
            },
        });

        if (!membership) {
            throw new NotFoundException(`No perteneces a este canal`);
        }

        await this.prisma.channelMember.delete({
            where: {
                userId_channelId: {
                    userId,
                    channelId,
                },
            },
        });

        return {
            message: 'Has salido del canal correctamente',
        };
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