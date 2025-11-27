import { Module } from '@nestjs/common';
import { ReservaService } from './reserva.service';
import { ReservaController } from './reserva.controller';
import { RedisModule } from 'src/redis/redis.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [RedisModule, PrismaModule],
  controllers: [ReservaController],
  providers: [ReservaService],
})
export class ReservaModule {}
