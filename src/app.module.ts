import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { TiendaModule } from './tienda/tienda.module';
import { ProductoModule } from './producto/producto.module';

@Module({
  imports: [
    // Carga y valida las variables de entorno
    ConfigModule.forRoot({
      isGlobal: true, // Disponible en toda la aplicación
    }),

    // Módulos de la aplicación
    AuthModule,
    TiendaModule,
    PrismaModule,
    ProductoModule,
  ],
})
export class AppModule {}
