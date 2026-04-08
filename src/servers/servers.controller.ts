import { Controller, Body, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards, HttpCode, } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateServerDto } from './dto/create-server.dto';
import { UpdateServerDto } from './dto/update-server.dto';
import { ServersService } from './servers.service';
import { createServer } from 'http';

@UseGuards(JwtAuthGuard) //Protejo todas las rutas de este controlador con JWT
@Controller('servers')
export class ServersController {
    constructor(private readonly serversService: ServersService) {}

    // POST/servers
    @Post()
    create(@Body() createServerDto: CreateServerDto) {
        return this.serversService.create(createServerDto);
    }

    // GET/servers
    @Get()
    findAll() {
        return this.serversService.findAll();
    }

    // GET/servers/:id
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.serversService.findOne(id);
    }

    // PATCH/servers/:id
    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateServerDto: UpdateServerDto,
    ) {
        return this.serversService.update(id, updateServerDto);
    }

    // DELETE/servers/:id
    @HttpCode(204)
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        await this.serversService.remove(id);
    }
}
