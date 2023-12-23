import {
  Controller,
  SerializeOptions,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Public, GetUser, Roles } from '../../common/decorators';
import { GROUPS, ROLE } from '../../common/enums';
import { AuthService } from '../services/auth.service';
import { SignUpDto, PasswordChangeDto, LoginDto } from '../dtos';
import { RolesGuard } from '../../common/guards';
import { IAuthController } from '../../common/interfaces';
import { User } from '../../models/users';
import { AuthUserResponse } from '../interfaces';

@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController implements IAuthController<AuthUserResponse> {
  constructor(private authService: AuthService) {}

  @Public()
  @SerializeOptions({ groups: [GROUPS.USER] })
  @ApiCreatedResponse({ type: AuthUserResponse })
  @Post('signup')
  signup(@Body() dto: SignUpDto) {
    return this.authService.signup(dto);
  }

  @Public()
  @SerializeOptions({ groups: [GROUPS.USER] })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login' })
  @ApiOkResponse({
    description: 'User logged in successfully',
    type: AuthUserResponse,
  })
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @ApiBearerAuth('token')
  @SerializeOptions({ groups: [GROUPS.USER] })
  @UseGuards(RolesGuard)
  @Roles(ROLE.USER)
  @Patch('updateMyPassword')
  updateMyPassword(
    @Body() dto: PasswordChangeDto,
    @GetUser('email') email: string,
  ) {
    return this.authService.updateMyPassword(dto, email);
  }
  forgotPassword(...n: any[]): Promise<AuthUserResponse> {
    return;
  }
  resetPassword(...n: any[]): Promise<AuthUserResponse> {
    return;
  }
}
