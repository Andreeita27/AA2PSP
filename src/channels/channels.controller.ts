import { Controller, Body, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';

@UseGuards(JwtAuthGuard)
@Controller() // Lo dejo vacío porque POST tiene otra ruta distinta
export class ChannelsController {
    constructor(private readonly channelsService: ChannelsService) {}

    // POST/servers/:serverId/channels
    @Post('/servers/:serverId/channels')
    create(
        @Param('serverId', ParseIntPipe) serverId: number,
        @Body()createChannelDto: CreateChannelDto,
    ) {
        return this.channelsService.create(createChannelDto, serverId);
    }

    // GET/channels
    @Get('channels')
    findAll() {
        return this.channelsService.findAll();
    }

    // GET/servers/:serverId/channels
    @Get('servers/:serverId/channels')
    findByServer(@Param('serverId', ParseIntPipe) serverId: number) {
        return this.channelsService.findByServer(serverId);
    }

    // GET/channels/:id
    @Get('channels/:id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.channelsService.findOne(id);
    }

    // PATCH/channels/:id
    @Patch('channels/:id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() UpdateChannelDto: UpdateChannelDto,
    ) {
        return this.channelsService.update(id, UpdateChannelDto);
    }

    // DELETE/channels/:id
    @HttpCode(204)
    @Delete('channels/:id')
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        await this.channelsService.remove(id);
    }
}
