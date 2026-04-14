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
