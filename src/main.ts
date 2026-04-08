import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Activamos ValidationPipe para validar automáticamente los dtos
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // elimina propiedades no definidas en el dto
      forbidNonWhitelisted: true, // lanza error si llegan propiedades extra
      transform: true, // transforma tipos automáticamente cuando es posible
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
