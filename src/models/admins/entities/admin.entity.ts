import { Entity, ManyToOne } from 'typeorm';
import { BasePerson } from '../../../common/entities/base-person.entity';
import { Expose, Transform } from 'class-transformer';
import { GROUPS } from '../../../common/enums/groups.enum';
import { Role } from '../../roles/entities/role.entity';

@Entity()
export class Admin extends BasePerson {
  @Expose({ groups: [GROUPS.ADMIN] })
  @Transform(({ value }) => value.name)
  @ManyToOne(() => Role, (role) => role.admins)
  role: Role;
}
