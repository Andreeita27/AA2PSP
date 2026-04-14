import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Discord Server API')
    .setDescription('Documentación de la API para gestionar un servidor tipo Discord')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('users')
    .addTag('servers')
    .addTag('channels')
    .addTag('messages')
    .addBearerAuth( // Agrega soporte para autenticación Bearer
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Introduce aquí el token obtenido al hacer login',
      },
      'JWT-auth', // Nombre del esquema de seguridad, debe coincidir con el usado en los controladores
    )
    .build();

  // Generamos el documento OpenAPI a partir de la app
  const documentFactory = () => SwaggerModule.createDocument(app, config);

  // Publicamos Swagger en /api/docs
  SwaggerModule.setup('api/docs', app, documentFactory, {
    customSiteTitle: 'Discord Server API Docs',
  });

  // Arrancamos la aplicación
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
