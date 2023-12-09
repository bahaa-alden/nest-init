import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BasePerson } from '../../../common/entities';
import { Exclude, Expose, Transform } from 'class-transformer';
import { GROUPS } from '../../../common/enums';
import { Role } from '../../roles';
import { EmployeePhoto } from './employee-image.entity';
import { Store } from '../../stores';

@Entity({ name: 'employees' })
export class Employee extends BasePerson {
  @Expose({ groups: [GROUPS.EMPLOYEE] })
  @Column()
  address: string;

  @Expose({ groups: [GROUPS.EMPLOYEE, GROUPS.ALL_EMPLOYEES] })
  @Transform(({ value }) => {
    return { id: value.id, name: value.name };
  })
  @ManyToOne(() => Store, (store) => store.employees)
  @JoinColumn({ name: 'storeId' })
  store: Store;

  // @Exclude()
  @Column()
  storeId: string;

  @Expose({ groups: [GROUPS.EMPLOYEE] })
  @Transform(({ value }) => value.name)
  @ManyToOne(() => Role, (role) => role.employees)
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @Exclude()
  @Column()
  roleId: string;

  @Exclude()
  @OneToMany(() => EmployeePhoto, (employeePhoto) => employeePhoto.employee, {
    cascade: true,
  })
  photos: EmployeePhoto[];

  photo() {
    if (this.photos) return this.photos[this.photos.length - 1];
    return undefined;
  }
}
