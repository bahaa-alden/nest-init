import { Injectable } from '@nestjs/common';
import { ROLE } from './../../../common/enums';
import {
  Employee,
  CreateEmployeeDto,
  UpdateEmployeeDto,
} from './../../../models/employees';
import { Role } from './../../../models/roles';
import { Repository, DataSource, Equal, FindOneOptions } from 'typeorm';
import { EmployeePhotosRepository } from './employee-photos.repository';
import { defaultPhoto } from '../../../common/constants';
import { Store } from '../../../models/stores';

@Injectable()
export class EmployeeRepository extends Repository<Employee> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly employeePhotosRepository: EmployeePhotosRepository,
  ) {
    super(Employee, dataSource.createEntityManager());
  }

  async createOne(dto: CreateEmployeeDto, role: Role, store: Store) {
    const employee = this.create({ ...dto, role, photos: [], store });
    employee.photos.push(this.employeePhotosRepository.create(defaultPhoto));
    await employee.save();
    return employee;
  }

  async findAll(withDeleted = false) {
    return this.find({
      where: { role: withDeleted ? {} : { name: Equal(ROLE.EMPLOYEE) } },
      withDeleted,
      relations: { photos: true, role: true },
    });
  }

  async findById(id: string, withDeleted = false) {
    const options: FindOneOptions<Employee> = {
      where: { id },
      withDeleted,
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        createdAt: true,
        updatedAt: true,
      },
      relations: { photos: true, role: true, store: true },
    };

    return await this.findOne(options);
  }

  async findByEmail(email: string) {
    return await this.findOne({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        createdAt: true,
        updatedAt: true,
      },
      relations: { photos: true, role: true, store: true },
    });
  }

  async updateOne(employee: Employee, dto: UpdateEmployeeDto, store: Store) {
    employee.photos.push(
      await this.employeePhotosRepository.uploadPhoto(dto.photo),
    );
    Object.assign<Employee, any>(employee, {
      email: dto.email,
      name: dto.name,
      password: dto.password,
      address: dto.address,
      store,
    });
    await this.save(employee);
    return this.findById(employee.id);
  }
}