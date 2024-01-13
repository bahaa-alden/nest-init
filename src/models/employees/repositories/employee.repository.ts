import { Inject, Injectable } from '@nestjs/common';
import { ROLE } from '../../../common/enums';
import { Role } from '../../roles';
import { Repository, Equal, FindOneOptions } from 'typeorm';
import { defaultPhoto } from '../../../common/constants';
import { Store } from '../../stores';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEmployeeDto, UpdateEmployeeDto } from '../dtos';
import { Employee } from '../entities/employee.entity';
import { IEmployeeRepository } from '../interfaces/repositories/employee.repository.interface';
import { IEmployeePhotosRepository } from '../interfaces/repositories/employee-photos.repository.interface';
import { EMPLOYEE_TYPES } from '../interfaces/type';

@Injectable()
export class EmployeeRepository implements IEmployeeRepository {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @Inject(EMPLOYEE_TYPES.repository.employee_photos)
    private readonly employeePhotosRepository: IEmployeePhotosRepository,
  ) {}

  async create(dto: CreateEmployeeDto, store: Store, role: Role) {
    const employee = this.employeeRepository.create({
      ...dto,
      role,
      photos: [],
      store,
    });
    employee.photos.push(this.employeePhotosRepository.create(defaultPhoto));
    await employee.save();
    return employee;
  }

  async find(withDeleted = false) {
    return this.employeeRepository.find({
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

    return await this.employeeRepository.findOne(options);
  }

  async findByEmail(email: string, withDeleted = false) {
    const options: FindOneOptions<Employee> = {
      where: { email },
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

    return await this.employeeRepository.findOne(options);
  }

  async update(
    employee: Employee,
    dto: UpdateEmployeeDto,
    store: Store,
  ): Promise<Employee> {
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
    await this.employeeRepository.save(employee);
    return this.findById(employee.id);
  }

  async recover(employee: Employee): Promise<Employee> {
    return this.employeeRepository.recover(employee);
  }

  async remove(employee: Employee): Promise<void> {
    await this.employeeRepository.softRemove(employee);
  }

  async validate(id: string): Promise<Employee> {
    return this.employeeRepository.findOne({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        passwordChangedAt: true,
        role: {
          id: true,
          name: true,
          permissions: {
            id: true,
            action: true,
            subject: true,
          },
        },
        createdAt: true,
        updatedAt: true,
        photos: false,
      },
      relations: {
        role: { permissions: true },
        photos: true,
      },
    });
  }
}
