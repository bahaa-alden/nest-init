import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseImage } from '../../../common';
import { Employee } from './employee.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'employee_images' })
export class EmployeeImage extends BaseImage {
  @ManyToOne(() => Employee, (employee) => employee.images)
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @Exclude()
  @Column()
  employeeId: string;
}
