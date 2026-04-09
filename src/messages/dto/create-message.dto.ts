import { IsNotEmpty, IsString } from "class-validator";

export class CreateMessageDto {
    // Contenido del mensaje
    @IsString({ message: "El contenido del mensaje debe ser una cadena de texto." })
    @IsNotEmpty({ message: "El contenido del mensaje no puede estar vacío." })
    content!: string;
}