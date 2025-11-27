import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { TiendaModule } from './tienda/tienda.module';
import { ProductoModule } from './producto/producto.module';
import { RedisModule } from './redis/redis.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { ReservaModule } from './reserva/reserva.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    TiendaModule,
    PrismaModule,
    ProductoModule,
    RedisModule,
    HttpModule,
    ReservaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
