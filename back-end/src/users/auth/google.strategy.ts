import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {

    constructor() {
        super({
            clientID: "852831021713-9mn1to38n96e4dqjj42i5569v6t2rl2o.apps.googleusercontent.com",
            clientSecret: "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",
            callbackURL: 'http://localhost:3000/auth/google/redirect',
            scope: ['email', 'profile'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {    
        const { name, emails, photos } = profile;
        const user = {
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            picture: photos[0].value,
            email_verified: true,
            accessToken,
        };
    
        console.log('User:', user);
    
        done(null, user);
    }
    
}
