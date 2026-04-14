import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

// PartialType crea una versión opcional de todos los campos de CreateUserDto
// Esto viene bien para las actualizaciones, porque no obligamos a enviar todos los datos
export class UpdateUserDto extends PartialType(CreateUserDto) {}