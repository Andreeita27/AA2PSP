import { Controller, Body, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Req, UseGuards, } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessagesService } from './messages.service';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiTags('messages')
@ApiBearerAuth('JWT-auth')
@ApiUnauthorizedResponse({
    description: 'No autorizado'
})
@UseGuards(JwtAuthGuard)
@Controller() //Vacio porque las rutas son distintas
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) {}

    // POST/channel/:channelId/message
    @Post('/channels/:channelId/messages')
    @ApiOperation({
        summary: 'Crea un mensaje',
        description: 'Crea un mensaje en un canal específico',
    })
    @ApiParam({
        name: 'channelId',
        example: 1,
        description: 'ID del canal donde se enviará el mensaje',
    })
    @ApiBody({
        type: CreateMessageDto,
        description: 'Datos para crear un mensaje',
    })
    @ApiOkResponse({
        description: 'Mensaje creado correctamente',
    })
    @ApiBadRequestResponse({
        description: 'Los datos enviados no son válidos',
    })
    create(
        @Param('channelId', ParseIntPipe) channelId: number,
        @Body() createMessageDto: CreateMessageDto,
        @Req() req: any,
    ) {
        return this.messagesService.create(createMessageDto, channelId, req.user.userId);
    }

    // GET/channels/:channelId/messages
    @Get('/channels/:channelId/messages')
    @ApiOperation({
        summary: 'Obtiene mensajes por canal',
        description: 'Obtiene todos los mensajes de un canal específico',
    })
    @ApiParam({
        name: 'channelId',
        example: 1,
        description: 'ID del canal del cual se obtendrán los mensajes',
    })
    @ApiOkResponse({
        description: 'Mensajes obtenidos correctamente',
    })
    @ApiBadRequestResponse({
        description: 'El ID del canal no es válido',
    })
    findByChannel(@Param('channelId', ParseIntPipe) channelId: number) {
        return this.messagesService.findByChannel(channelId);
    }

    // GET/messages/:id
    @Get('/messages/:id')
    @ApiOperation({
        summary: 'Obtiene un mensaje por ID',
        description: 'Obtiene un mensaje específico por su ID',
    })
    @ApiParam({
        name: 'id',
        example: 1,
        description: 'ID del mensaje a obtener',
    })
    @ApiOkResponse({
        description: 'Mensaje obtenido correctamente',
    })
    @ApiBadRequestResponse({
        description: 'El ID del mensaje no es válido',
    })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.messagesService.findOne(id);
    }

    // DELETE/messages/:id
    @HttpCode(204)
    @Delete('/messages/:id')
    @ApiOperation({
        summary: 'Elimina un mensaje',
        description: 'Elimina un mensaje específico por su ID',
    })
    @ApiParam({
        name: 'id',
        example: 1,
        description: 'ID del mensaje a eliminar',
    })
    @ApiNoContentResponse({
        description: 'Mensaje eliminado correctamente',
    })
    @ApiBadRequestResponse({
        description: 'El ID del mensaje no es válido',
    })
    async remove(@Param('id', ParseIntPipe) id: number, @Req() req: any): Promise<void> {
        await this.messagesService.remove(id, req.user.userId);
    }
}
