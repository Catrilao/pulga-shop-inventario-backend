import { Injectable } from '@nestjs/common';

@Injectable()
export class RedisService {
  async isProductoInReserva(sku: string): Promise<boolean> {
    // TODO: implementar chequeo real
    return false;
  }
}
