import { Controller, Body, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiTags('channels')
@ApiBearerAuth('JWT-auth')
@ApiUnauthorizedResponse({
    description: 'No autorizado'
})
@UseGuards(JwtAuthGuard)
@Controller() // Lo dejo vacío porque POST tiene otra ruta distinta
export class ChannelsController {
    constructor(private readonly channelsService: ChannelsService) {}

    // POST/servers/:serverId/channels
    @Post('/servers/:serverId/channels')
    @ApiOperation({
        summary: 'Crear un nuevo canal',
        description: 'Crea un nuevo canal dentro de un servidor específico',
    })
    @ApiBody({
        type: CreateChannelDto,
        description: 'Datos necesarios para crear un canal',
    })
    @ApiOkResponse({
        description: 'Canal creado correctamente',
    })
    create(
        @Param('serverId', ParseIntPipe) serverId: number,
        @Body()createChannelDto: CreateChannelDto,
    ) {
        return this.channelsService.create(createChannelDto, serverId);
    }

    // GET/channels
    @Get('channels')
    @ApiOperation({
        summary: 'Obtener todos los canales',
        description: 'Devuelve una lista de todos los canales disponibles en todos los servidores',
    })
    @ApiOkResponse({
        description: 'Lista de canales obtenida correctamente',
    })
    findAll() {
        return this.channelsService.findAll();
    }

    // GET/servers/:serverId/channels
    @Get('servers/:serverId/channels')
    @ApiOperation({
        summary: 'Obtener canales de un servidor',
        description: 'Devuelve una lista de todos los canales que pertenecen a un servidor específico',
    })
    @ApiParam({
        name: 'serverId',
        example: 1,
        description: 'ID del servidor del que se quieren obtener los canales',
    })
    @ApiOkResponse({
        description: 'Lista de canales del servidor obtenida correctamente',
    })
    @ApiBadRequestResponse({
        description: 'ID del servidor inválido',
    })
    findByServer(@Param('serverId', ParseIntPipe) serverId: number) {
        return this.channelsService.findByServer(serverId);
    }

    // GET/channels/:id
    @Get('channels/:id')
    @ApiOperation({
        summary: 'Obtener un canal por ID',
        description: 'Devuelve los detalles de un canal específico',
    })
    @ApiParam({
        name: 'id',
        example: 1,
        description: 'ID del canal que se quiere obtener',
    })
    @ApiOkResponse({
        description: 'Canal obtenido correctamente',
    })
    @ApiBadRequestResponse({
        description: 'ID del canal inválido',
    })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.channelsService.findOne(id);
    }

    // PATCH/channels/:id
    @Patch('channels/:id')
    @ApiOperation({
        summary: 'Actualizar un canal',
        description: 'Actualiza los detalles de un canal específico',
    })
    @ApiParam({
        name: 'id',
        example: 1,
        description: 'ID del canal que se quiere actualizar',
    })
    @ApiBody({
        type: UpdateChannelDto,
        description: 'Datos que se pueden actualizar del canal',
    })
    @ApiOkResponse({
        description: 'Canal actualizado correctamente',
    })
    @ApiBadRequestResponse({
        description: 'ID del canal inválido o datos de actualización incorrectos',
    })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() UpdateChannelDto: UpdateChannelDto,
    ) {
        return this.channelsService.update(id, UpdateChannelDto);
    }

    // DELETE/channels/:id
    @HttpCode(204)
    @Delete('channels/:id')
    @ApiOperation({
        summary: 'Eliminar un canal',
        description: 'Elimina un canal específico',
    })
    @ApiParam({
        name: 'id',
        example: 1,
        description: 'ID del canal que se quiere eliminar',
    })
    @ApiNoContentResponse({
        description: 'Canal eliminado correctamente',
    })
    @ApiBadRequestResponse({
        description: 'ID del canal inválido',
    })
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        await this.channelsService.remove(id);
    }
}
