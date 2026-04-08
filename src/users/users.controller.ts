import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
    constructor (private readonly usersService: UsersService) {}

    // POST/users
    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    // GET/users
    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    // GET/users/:id
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.findOne(id);
    }

    // PATCH/users/:id
    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        return this.usersService.update(id, updateUserDto);
    }

    // DELETE/users/:id
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.remove(id);
    }
}
