import { Controller, Body, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Req, UseGuards, } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessagesService } from './messages.service';

@UseGuards(JwtAuthGuard)
@Controller() //Vacio porque las rutas son distintas
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) {}

    // POST/channel/:channelId/message
    @Post('/channels/:channelId/messages')
    create(
        @Param('channelId', ParseIntPipe) channelId: number,
        @Body() createMessageDto: CreateMessageDto,
        @Req() req: any,
    ) {
        return this.messagesService.create(createMessageDto, channelId, req.user.userId);
    }

    // GET/channels/:channelId/messages
    @Get('/channels/:channelId/messages')
    findByChannel(@Param('channelId', ParseIntPipe) channelId: number) {
        return this.messagesService.findByChannel(channelId);
    }

    // GET/messages/:id
    @Get('/messages/:id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.messagesService.findOne(id);
    }

    // DELETE/messages/:id
    @HttpCode(204)
    @Delete('/messages/:id')
    async remove(@Param('id', ParseIntPipe) id: number, @Req() req: any): Promise<void> {
        await this.messagesService.remove(id, req.user.userId);
    }
}
