import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  checkHealth(): string {
    return JSON.stringify({
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  }
}
