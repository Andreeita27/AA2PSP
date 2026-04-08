import { PartialType } from '@nestjs/mapped-types';
import { CreateServerDto } from './create-server.dto';

//PartialType convierte todos los campos en opcionales para poder actualziar parcial con PATCH
export class UpdateServerDto extends PartialType(CreateServerDto) {}