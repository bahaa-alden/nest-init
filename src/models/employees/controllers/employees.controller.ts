import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Employee } from '../entities/employee.entity';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { EmployeesService } from '../services/employees.service';
import { Public, CheckAbilities } from '../../../common/decorators';
import { GROUPS, Entities, Action } from '../../../common/enums';
import { CaslAbilitiesGuard, JwtGuard } from '../../../common/guards';
import { CreateEmployeeDto, UpdateEmployeeDto } from '../dtos';
import { LoginResponseDto, LoginUserDto } from '../../../auth';

@ApiTags('Employees')
@ApiBadRequestResponse({ description: 'Bad request' })
@ApiForbiddenResponse({ description: 'You can not perform this action' })
@Controller({ path: 'employees', version: '1' })
export class EmployeesAuthController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Public()
  @ApiOperation({ summary: 'Login' })
  @ApiOkResponse({
    description: 'Employee logged in successfully',
    type: LoginResponseDto,
  })
  @SerializeOptions({ groups: [GROUPS.EMPLOYEE] })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() dto: LoginUserDto) {
    return this.employeesService.login(dto);
  }
}

@ApiTags('Employees')
@ApiBearerAuth('token')
@ApiBadRequestResponse({ description: 'Bad request' })
@ApiForbiddenResponse({ description: 'You can not perform this action' })
@UseGuards(CaslAbilitiesGuard)
@Controller({ path: 'employees', version: '1' })
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}
  @ApiOkResponse({ type: Employee })
  @SerializeOptions({ groups: [GROUPS.ALL_EMPLOYEES] })
  @CheckAbilities({ action: Action.Read, subject: Entities.Employee })
  @Get()
  findAll() {
    return this.employeesService.findAll();
  }

  @SerializeOptions({ groups: [GROUPS.EMPLOYEE] })
  @ApiOkResponse({ type: Employee })
  @CheckAbilities({ action: Action.Create, subject: Entities.Employee })
  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  @SerializeOptions({ groups: [GROUPS.EMPLOYEE] })
  @ApiOkResponse({ type: Employee })
  @CheckAbilities({ action: Action.Read, subject: Entities.Employee })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.employeesService.findOne(id);
  }

  @SerializeOptions({ groups: [GROUPS.EMPLOYEE] })
  @ApiOkResponse({ type: Employee })
  @CheckAbilities({ action: Action.Update, subject: Entities.Employee })
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateEmployeeDto,
  ) {
    return this.employeesService.update(id, dto);
  }

  @ApiNoContentResponse()
  @CheckAbilities({ action: Action.Delete, subject: Entities.Employee })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.employeesService.remove(id);
  }

  @ApiOperation({ summary: 'recover deleted Employee' })
  @CheckAbilities({ action: Action.Update, subject: Entities.Employee })
  @SerializeOptions({ groups: [GROUPS.EMPLOYEE] })
  @HttpCode(HttpStatus.OK)
  @Post(':id/recover')
  recover(@Param('id', ParseUUIDPipe) id: string) {
    return this.employeesService.recover(id);
  }
}
