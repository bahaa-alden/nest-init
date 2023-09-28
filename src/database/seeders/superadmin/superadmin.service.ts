import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { superadmin } from './data';
import { ROLE } from '../../../common/enums';
import { Role } from '../../../models/roles/entities/role.entity';
import { Admin } from '../../../models/admins/entities/admin.entity';

@Injectable()

/**
 * Service adding superadmin.
 *
 * @class
 */
export class SuperadminService {
  /**
   * Create an instance of class.
   *
   * @constructs
   *
   * @param {Repository<Admin>} adminRepository
   */
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}
  /**
   * Seed all Admin.
   *
   * @function
   */
  async create(): Promise<Admin> {
    return await this.adminRepository
      .findOne({
        where: { role: { name: ROLE.SUPER_ADMIN } },
        relations: { role: true },
      })
      .then(async (dbSuper) => {
        // We check if a superadmin already exists.
        // If it does don't create a new one.
        if (dbSuper) {
          return Promise.resolve(null);
        }
        const role = await this.roleRepository.findOneBy({
          name: ROLE.SUPER_ADMIN,
        });
        const admin = this.adminRepository.create({
          name: superadmin.name,
          email: superadmin.email,
          password: superadmin.password,
          role,
        });
        return Promise.resolve(
          // or create(superadmin).then(() => { ... });
          await this.adminRepository.insert(admin),
        );
      })
      .catch((error) => Promise.reject(error));
  }
}
