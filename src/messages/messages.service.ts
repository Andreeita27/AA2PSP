import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
    constructor(private readonly prisma: PrismaService) {}

    // Crear un mensaje dentro de un canal concreto
    // ChannelId de la URL y userID del token
    async create(createMessageDto: CreateMessageDto, channelId: number, userId: number) {
        // Verificar que el canal existe
        const channel = await this.prisma.channel.findUnique({
            where: { id: channelId },
        });

        if (!channel) {
            throw new NotFoundException(`El canal con ID ${channelId} no existe.`);
        }

        //Verificar que el usuario existe
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException(`El usuario con ID ${userId} no existe.`);
        }

        return this.prisma.message.create({
            data: {
                content: createMessageDto.content,
                channelId,
                userId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        createdAt: true,
                    },
                },
                channel: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                        serverId: true,
                        createdAt: true,
                    },
                },
            },
        });
    }

    //Obtener todos los mensajes de un canal concreto
    async findByChannel(channelId: number) {
        // Verificar que el canal existe
        const channel = await this.prisma.channel.findUnique({
            where: { id: channelId },
        });

        if (!channel) {
            throw new NotFoundException(`El canal con ID ${channelId} no existe.`);
        }

        return this.prisma.message.findMany({
            where: { channelId },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        createdAt: true,
                    },
                },
                channel: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                        serverId: true,
                        createdAt: true,
                    },
                },

            },
            orderBy: {
                createdAt: 'asc',
            },
        });
    }

    // Obtener un mensaje concreto por su id
    async findOne(id: number) {
        const message = await this.prisma.message.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        createdAt: true,
                    },
                },
                channel: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                        serverId: true,
                        createdAt: true,
                    },
                },
            },
        });

        if (!message) {
            throw new NotFoundException(`El mensaje con ID ${id} no existe.`);
        }
        return message;
    }

    // Eliminar un mensaje concreto por su id
    // Solo el usuario que lo ha creado puede eliminarlo
    async remove(id: number, userId: number) {
        // Verificar que el mensaje existe
        const message = await this.prisma.message.findUnique({
            where: { id },
        });

        if (!message) {
            throw new NotFoundException(`El mensaje con ID ${id} no existe.`);
        }

        //Verificar que el usuario autenticado sea el autor del mensaje
        if (message.userId !== userId) {
            throw new ForbiddenException(`No puedes eliminar un mensaje de otro usuario.`);
        }

        await this.prisma.message.delete({
            where: { id },
        });
    }
}