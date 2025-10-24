import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS para permitir conexiones desde el frontend
  app.enableCors({
    origin: 'http://localhost:5173', // URL del frontend (Vite usa el puerto 5173 por defecto)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  // Configuración global de validación de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades que no están en el DTO
      transform: true, // Transforma los datos recibidos al tipo del DTO
    }),
  );

  // Prefijo global para todas las rutas de la API
  app.setGlobalPrefix('api');

  app.useGlobalFilters(new AllExceptionsFilter());

  try {
    const documentYaml = fs.readFileSync('docs/docs.yaml', 'utf8');
    const document = yaml.load(documentYaml) as Record<string, unknown>;
    SwaggerModule.setup('docs', app, document as any);
  } catch (err) {
    console.warn('No se pudo cargar la documentación Swagger: ', err);
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Aplicación ejecutándose en: http://localhost:${port}/api`);
}
bootstrap().catch((err) => {
  console.error(`Error al iniciar la aplicación: ${err}`);
  process.exit(1);
});
