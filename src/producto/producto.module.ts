import { Module } from '@nestjs/common';
import { ProductoController } from './producto.controller';
import { ProductoService } from './producto.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { RedisModule } from 'src/redis/redis.module';
import { LoggerModule } from 'src/logger/logger.module';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    RedisModule,
    LoggerModule,
    CloudinaryModule,
  ],
  controllers: [ProductoController],
  providers: [ProductoService, RolesGuard],
})
export class ProductoModule {}
