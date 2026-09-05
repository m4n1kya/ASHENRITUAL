/**
 * @fileoverview ASHENRITUAL Architecture
 * @module cart.module.ts
 */
import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

@Module({
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
