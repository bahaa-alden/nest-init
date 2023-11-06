import { Injectable } from '@nestjs/common';
import { defaultImage, ROLE } from './../../../common';
import {
  Employee,
  CreateEmployeeDto,
  UpdateEmployeeDto,
} from './../../../models/employees';
import { Role } from './../../../models/roles';
import { Repository, DataSource, Equal, FindOneOptions } from 'typeorm';
import { EmployeeImagesRepository } from './employee-images.repository';

@Injectable()
export class EmployeeRepository extends Repository<Employee> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly employeeImagesRepository: EmployeeImagesRepository,
  ) {
    super(Employee, dataSource.createEntityManager());
  }

  async createOne(dto: CreateEmployeeDto, role: Role) {
    const employee = this.create({ ...dto, role, images: [] });
    employee.images.push(this.employeeImagesRepository.create(defaultImage));
    await employee.save();
    return employee;
  }

  async findAll(withDeleted = false) {
    return this.find({
      where: { role: withDeleted ? {} : { name: Equal(ROLE.EMPLOYEE) } },
      withDeleted,
      relations: { images: true, role: true },
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
      relations: { images: true, role: true, store: true },
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
      relations: { images: true, role: true, store: true },
    });
  }

  async updateOne(employee: Employee, dto: UpdateEmployeeDto) {
    employee.images.push(
      await this.employeeImagesRepository.updatePhoto(dto.photo),
    );
    Object.assign<Employee, any>(employee, {
      email: dto.email,
      name: dto.name,
      password: dto.password,
      address: dto.address,
      store: { id: dto.storeId },
    });
    await this.save(employee);
    return this.findById(employee.id);
  }
}
