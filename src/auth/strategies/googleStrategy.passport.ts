import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-token';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import RequestWithUser from '../interfaces/requestWithIUser.interface';
import { CreateQuery, FilterQuery } from 'mongoose';
import { User, UserDocument } from 'src/users/models/_user.model';
import { StripeService } from 'src/stripe/stripe.service';

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly usersService: UsersService,
    private readonly stripeService: StripeService,
  ) {
    super({
      clientID: process.env.clientID,
      clientSecret: process.env.clientSecret,
      passReqToCallback: true,
    });
  }

  async validate(
    req: RequestWithUser,
    _accessToken,
    _refreshToken,
    profile,
    done,
  ) {
    const { id, displayName, emails, _json } = profile;
    let user = await this.usersService.findOne({
      googleId: id,
    } as FilterQuery<UserDocument>);

    if (!user) {
      const stripeCustomer = await this.stripeService.createCustomerEmail(
        displayName,
        emails[0].value,
      );
      user = await this.usersService.createUser({
        username: displayName,
        email: emails[0].value,
        photo: _json.picture,
        googleId: id,
        role: 'student',
        stripeCustomerId: stripeCustomer.id,
        enabled: true,
      } as CreateQuery<UserDocument>);
    }
    req.me = user;
    done(null, req.me);
  }
}
