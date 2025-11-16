import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { getErrorCodeFromMetadata } from './common/decorators/error-code.decorator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const RAW_CORS =
    process.env.CORS_ORIGINS ||
    process.env.CORS_ORIGIN ||
    'http://localhost:5173';
  const origins = RAW_CORS.split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  app.enableCors({
    origin: origins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  // Configuración global de validación de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades que no están en el DTO
      transform: true, // Transforma los datos recibidos al tipo del DTO
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
      exceptionFactory: (validationErrors) => {
        const first = validationErrors.flatMap((error) =>
          Object.values(error.constraints || {}).map((msg) => ({
            property: error.property,
            msg,
            target: error.target,
          })),
        )[0];

        const message = first?.msg ?? 'Datos inválidos';

        let errorCode: string | undefined;
        if (first?.target && first.property) {
          errorCode = getErrorCodeFromMetadata(first.target, first.property);
        }

        return new BadRequestException({
          message,
          error: errorCode,
        });
      },
    }),
  );

  const apiPrefix = process.env.API_PREFIX || 'api';
  app.setGlobalPrefix(apiPrefix);

  app.useGlobalFilters(new AllExceptionsFilter());

  try {
    const documentYaml = fs.readFileSync('docs/docs.yaml', 'utf8');
    const document = yaml.load(documentYaml) as Record<string, unknown>;
    SwaggerModule.setup('docs', app, document as any);
  } catch (err) {
    console.warn('No se pudo cargar la documentación Swagger: ', err);
  }

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(
    `Aplicación ejecutándose en: http://localhost:${port}/${apiPrefix}`,
  );
}
bootstrap().catch((err) => {
  console.error(`Error al iniciar la aplicación: ${err}`);
  process.exit(1);
});
