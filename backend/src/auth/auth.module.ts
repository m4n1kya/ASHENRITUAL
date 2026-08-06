import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './jwt.strategy';
import { GoogleStrategy } from './google.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => {
        if (!process.env.JWT_SECRET) {
          throw new Error('JWT_SECRET is not defined in environment variables');
        }
        return {
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '15m' }, // Aligned with auth.service.ts
        };
      },
    }),
  ],
  providers: [AuthService, JwtStrategy, GoogleStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
