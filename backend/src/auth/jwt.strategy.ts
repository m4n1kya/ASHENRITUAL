import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: (() => {
        if (!process.env.JWT_SECRET)
          throw new Error('JWT_SECRET is not defined');
        return process.env.JWT_SECRET;
      })(),
    });
  }

  async validate(payload: any) {
    return {
      id: payload.sub,
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
