import { Controller, Body, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards, HttpCode, Req, } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateServerDto } from './dto/create-server.dto';
import { UpdateServerDto } from './dto/update-server.dto';
import { ServersService } from './servers.service';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiTags('servers')
@ApiBearerAuth('JWT-auth')
@ApiUnauthorizedResponse({
    description: 'No autorizado. Se requiere un token JWT válido para acceder a esta ruta.',
})
@UseGuards(JwtAuthGuard) //Protejo todas las rutas de este controlador con JWT
@Controller('servers')
export class ServersController {
    constructor(private readonly serversService: ServersService) {}

    // POST/servers
    @Post()
    @ApiOperation({
        summary: 'Crear un servidor',
        description:'Crea un nuevo servidor en la plataforma',
    })
    @ApiBody({
        type: CreateServerDto,
        description: 'Datos necesarios para crear un nuevo servidor',
    })
    @ApiOkResponse({
        description: 'Servidor creado correctamente',
    })
    @ApiBadRequestResponse({
        description: 'Los datos enviados no son válidos',
    })
    create(@Body() createServerDto: CreateServerDto, @Req() req: any) {
        return this.serversService.create(createServerDto, req.user.userId);
    }

    // GET/servers
    @Get()
    @ApiOperation({
        summary: 'Obtener todos los servidores',
        description: 'Devuelve una lista de todos los servidores existentes',
    })
    @ApiOkResponse({
        description: 'Lista de servidores obtenida correctamente',
    })
    findAll() {
        return this.serversService.findAll();
    }

    // GET/servers/me/joined
    @Get('me/joined')
    @ApiOperation({
        summary: 'Obtener mis servidores',
        description: 'Devuelve los servidores a los que está unido el usuario autenticado',
    })
    @ApiOkResponse({
        description: 'Lista de servidores del usuario obtenida correctamente',
    })
    findMyServers(@Req() req: any) {
        return this.serversService.findMyServers(req.user.userId);
    }

    // POST/servers/:id/join
    @Post(':id/join')
    @ApiOperation({
        summary: 'Unirse a un servidor',
        description: 'Permite al usuario autenticado unirse a un servidor',
    })
    @ApiParam({
        name: 'id',
        example: 1,
        description: 'ID del servidor al que el usuario quiere unirse',
    })
    @ApiOkResponse({
        description: 'Usuario unido al servidor correctamente',
    })
    @ApiBadRequestResponse({
        description: 'El ID enviado no es válido',
    })
    joinServer(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
        return this.serversService.joinServer(id, req.user.userId);
    }

    // DELETE/servers/:id/join
    @HttpCode(204)
    @Delete(':id/join')
    @ApiOperation({
        summary: 'Salir de un servidor',
        description: 'Permite al usuario autenticado salir de un servidor',
    })
    @ApiParam({
        name: 'id',
        example: 1,
        description: 'ID del servidor del que el usuario quiere salir',
    })
    @ApiNoContentResponse({
        description: 'Usuario eliminado del servidor correctamente',
    })
    @ApiBadRequestResponse({
        description: 'El ID enviado no es válido',
    })
    leaveServer(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
        return this.serversService.leaveServer(id, req.user.userId);
    }

    // GET/servers/:id
    @Get(':id')
    @ApiOperation({
        summary: 'Obtener un servidor por ID',
        description: 'Devuelve los detalles de un servidor específico identificado por su ID',
    })
    @ApiParam({
        name: 'id',
        example: 1,
        description: 'ID del servidor que se desea obtener',
    })
    @ApiOkResponse({
        description: 'Servidor obtenido correctamente',
    })
    @ApiBadRequestResponse({
        description: 'El ID enviado no es válido',
    })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.serversService.findOne(id);
    }

    // PATCH/servers/:id
    @Patch(':id')
    @ApiOperation({
        summary: 'Actualizar un servidor',
        description: 'Actualiza parcialmente la información de un servidor específico',
    })
    @ApiParam({
        name: 'id',
        example: 1,
        description: 'ID del servidor que se desea actualizar',
    })
    @ApiBody({
        type: UpdateServerDto,
        description: 'Datos que se desean actualizar del servidor',
    })
    @ApiOkResponse({
        description: 'Servidor actualizado correctamente',
    })
    @ApiBadRequestResponse({
        description: 'Los datos enviados no son válidos',
    })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateServerDto: UpdateServerDto,
    ) {
        return this.serversService.update(id, updateServerDto);
    }

    // DELETE/servers/:id
    @HttpCode(204)
    @Delete(':id')
    @ApiOperation({
        summary: 'Eliminar un servidor',
        description: 'Elimina un servidor específico'
    })
    @ApiParam({
        name: 'id',
        example: 1,
        description: 'ID del servidor que se desea eliminar',
    })
    @ApiNoContentResponse({
        description: 'Servidor eliminado correctamente',
    })
    @ApiBadRequestResponse({
        description: 'El ID enviado no es válido',
    })
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        await this.serversService.remove(id);
    }
}
