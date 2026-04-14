import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, HttpCode, } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiNoContentResponse, ApiParam, ApiBearerAuth, ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse, } from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth('JWT-auth') // Indica que estas rutas usan token
@ApiUnauthorizedResponse({
    description: 'Falta token o es inválido',
})
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
    constructor (private readonly usersService: UsersService) {}

    // POST/users
    @Post()
    @ApiOperation({
        summary: 'Crear un usuario',
        description: 'Crea un nuevo usuario en la plataforma',
    })
    @ApiBody({
        type: CreateUserDto,
        description: 'Datos necesarios para crear un usuario',
    })
    @ApiOkResponse({
        description: 'Usuario creado correctamente',
    })
    @ApiBadRequestResponse({
        description: 'Los datos enviados no son válidos',
    })
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    // GET/users
    @Get()
    @ApiOperation({
        summary: 'Listar todos los usuarios',
        description: 'Devuelve un listado de todos los usuarios registrados',
    })
    @ApiOkResponse({
        description: 'Listado de usuarios obtenido correctamente',
    })
    findAll() {
        return this.usersService.findAll();
    }

    // GET/users/:id
    @Get(':id')
    @ApiOperation({
        summary: 'Obtener un usuario por ID',
        description: 'Devuelve los datos de un usuario concreto',
    })
    @ApiParam({
        name: 'id',
        example: 1,
        description: 'ID del usuario',
    })
    @ApiOkResponse({
        description: 'Usuario encontrado correctamente',
    })
    @ApiBadRequestResponse({
        description: 'El ID enviado no existe',
    })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.findOne(id);
    }

    // PATCH/users/:id
    @Patch(':id')
    @ApiOperation({
        summary: 'Actualizar un usuario',
        description: 'Actualiza parcialmente los datos de un usuario',
    })
    @ApiParam({
        name: 'id',
        example: 1,
        description: 'ID del usuario a actualizar',
    })
    @ApiBody({
        type: UpdateUserDto,
        description: 'Campos del usuario que se quieren modificar',
    })
    @ApiOkResponse({
        description: 'Usuario actualizado correctamente',
    })
    @ApiBadRequestResponse({
        description: 'Los datos enviados no son válidos o el ID no existe',
    })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        return this.usersService.update(id, updateUserDto);
    }

    // DELETE/users/:id
    @HttpCode(204)
    @Delete(':id')
    @ApiOperation({
        summary: 'Eliminar un usuario',
        description: 'Elimina un usuario de la base de datos',
    })
    @ApiParam({
        name: 'id',
        example: 1,
        description: 'ID del usuario a eliminar',
    })
    @ApiNoContentResponse({
        description: 'Usuario eliminado correctamente',
    })
    @ApiBadRequestResponse({
        description: 'El ID enviado no existe',
    })
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        await this.usersService.remove(id);
    }
}
