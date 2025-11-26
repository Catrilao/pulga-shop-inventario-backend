import { Module } from '@nestjs/common';
import { TiendaController } from './tienda.controller';
import { TiendaService } from './tienda.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { RedisModule } from 'src/redis/redis.module';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  imports: [PrismaModule, AuthModule, RedisModule, LoggerModule],
  controllers: [TiendaController],
  providers: [TiendaService, RolesGuard],
  exports: [TiendaService],
})
export class TiendaModule {}
