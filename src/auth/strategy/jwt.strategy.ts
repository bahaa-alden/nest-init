// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { InjectModel } from '@nestjs/mongoose';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';

// type jwtPayload = { sub: string; email: string; iat: number; exp: number };
// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
//   constructor(config: ConfigService) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: config.get('JWT_SECRET'),
//     });
//   }
//   async validate(payload: jwtPayload) {
//     // const user = await this.userModel.findOne({ email: payload.email });
//     // if (!user) {
//     //   throw new UnauthorizedException({
//     //     message: 'The user belonging to this token does no longer exist',
//     //   });
//     // }

//     return 'user';
//   }
// }
