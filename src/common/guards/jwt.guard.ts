import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

//the use of inheritance  suppose calling super function
export class JwtGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Call the super.canActivate method to trigger the authentication process
    return super.canActivate(context);
  }
}
