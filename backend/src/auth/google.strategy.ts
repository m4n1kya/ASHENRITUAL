import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID || 'PLACEHOLDER_CLIENT_ID',
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET || 'PLACEHOLDER_CLIENT_SECRET',
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        'http://localhost:4000/api/v1/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos, id } = profile;
    const user = {
      email: emails[0].value,
      firstName: name?.givenName,
      lastName: name?.familyName,
      picture: photos?.[0]?.value,
      accessToken,
      providerId: id,
    };

    // Validate or create user in our database
    const dbUser = await this.authService.validateOAuthLogin(user);
    done(null, dbUser);
  }
}
