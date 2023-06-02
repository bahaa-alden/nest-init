import { AuthGuard } from '@nestjs/passport';

//the use of inheritance  suppose calling super function
export class JwtGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
}
