import {
  ApiBearerAuth,
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
import { LoginResponseDto, LoginDto } from '../../../auth';
import { Public, CheckAbilities } from '../../../common';
import { GROUPS, Entities, Action } from '../../../common';
import { CaslAbilitiesGuard, JwtGuard } from '../../../common';
import { CreateEmployeeDto, UpdateEmployeeDto } from '../dtos';

@ApiTags('Employees')
@Controller({ path: 'employees', version: '1' })
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Public()
  @SerializeOptions({ groups: [GROUPS.EMPLOYEE] })
  @ApiOperation({ summary: 'Login' })
  @ApiOkResponse({
    description: 'Employee logged in successfully',
    type: LoginResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.employeesService.login(dto);
  }

  @ApiBearerAuth('token')
  @UseGuards(CaslAbilitiesGuard)
  @SerializeOptions({ groups: [GROUPS.ALL_EMPLOYEES] })
  @ApiOkResponse({ type: Employee })
  @CheckAbilities({ action: Action.Read, subject: Entities.Employee })
  @Get()
  findAll() {
    return this.employeesService.findAll();
  }

  @ApiBearerAuth('token')
  @UseGuards(CaslAbilitiesGuard)
  @SerializeOptions({ groups: [GROUPS.EMPLOYEE] })
  @ApiOkResponse({ type: Employee })
  @CheckAbilities({ action: Action.Create, subject: Entities.Employee })
  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  @ApiBearerAuth('token')
  @UseGuards(CaslAbilitiesGuard)
  @SerializeOptions({ groups: [GROUPS.EMPLOYEE] })
  @ApiOkResponse({ type: Employee })
  @CheckAbilities({ action: Action.Read, subject: Entities.Employee })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.employeesService.findOne(id);
  }

  @ApiBearerAuth('token')
  @UseGuards(JwtGuard, CaslAbilitiesGuard)
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

  @ApiBearerAuth('token')
  @UseGuards(JwtGuard, CaslAbilitiesGuard)
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
