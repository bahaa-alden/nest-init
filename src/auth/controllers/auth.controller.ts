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
import {
  Public,
  GetUser,
  CheckAbilities,
  Roles,
} from '../../common/decorators';
import { Action, Entities, GROUPS, ROLE } from '../../common/enums';
import { AuthService } from '../services/auth.service';
import {
  SignUpDto,
  LoginResponseDto,
  PasswordChangeDto,
  LoginUserDto,
} from '../dtos';
import { CaslAbilitiesGuard, RolesGuard } from '../../common/guards';

@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @SerializeOptions({ groups: [GROUPS.USER] })
  @ApiCreatedResponse({ type: SignUpDto })
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
    type: LoginResponseDto,
  })
  @Post('login')
  login(@Body() dto: LoginUserDto) {
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
}
