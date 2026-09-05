/**
 * @fileoverview ASHENRITUAL Architecture
 * @module app.service.ts
 */
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
