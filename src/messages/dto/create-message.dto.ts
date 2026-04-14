import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateMessageDto {
    // Contenido del mensaje
    @ApiProperty({
        example: 'Hola a todos',
        description:'Contenido del mensaje que se envía',
    })
    @IsString({ message: "El contenido del mensaje debe ser una cadena de texto." })
    @IsNotEmpty({ message: "El contenido del mensaje no puede estar vacío." })
    content!: string;
}