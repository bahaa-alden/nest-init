import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
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
import { CaslAbilitiesGuard } from '../../../common/guards';
import { CreateEmployeeDto, UpdateEmployeeDto } from '../dtos';
import { LoginDto } from '../../../auth';
import { ICrud } from '../../../common/interfaces';
import { AuthEmployeeResponse } from '../interfaces';

@ApiTags('Employees')
@ApiBadRequestResponse({ description: 'Bad request' })
@ApiForbiddenResponse({ description: 'You can not perform this action' })
@ApiNotFoundResponse({ description: 'Data Not found' })
@Controller({ path: 'employees', version: '1' })
export class EmployeesAuthController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Public()
  @ApiOperation({ summary: 'Login' })
  @ApiOkResponse({
    description: 'Employee logged in successfully',
    type: AuthEmployeeResponse,
  })
  @SerializeOptions({ groups: [GROUPS.EMPLOYEE] })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.employeesService.login(dto);
  }
}

@ApiTags('Employees')
@ApiBearerAuth('token')
@ApiBadRequestResponse({ description: 'Bad request' })
@ApiForbiddenResponse({ description: 'You can not perform this action' })
@ApiNotFoundResponse({ description: 'Data Not found' })
@UseGuards(CaslAbilitiesGuard)
@Controller({ path: 'employees', version: '1' })
export class EmployeesController implements ICrud<Employee> {
  constructor(private readonly employeesService: EmployeesService) {}
  @ApiOkResponse({ type: Employee })
  @SerializeOptions({ groups: [GROUPS.ALL_EMPLOYEES] })
  @CheckAbilities({ action: Action.Read, subject: Entities.Employee })
  @Get()
  get() {
    return this.employeesService.get();
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
  getOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.employeesService.getOne(id);
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
