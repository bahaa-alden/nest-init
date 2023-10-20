import { Module, forwardRef } from '@nestjs/common';
import { AdminsController } from './admins.controller';
import { CaslModule } from '../../shared/casl';
import { AdminsService } from './admins.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { Role } from '../roles';
import { JwtTokenModule } from '../../shared/jwt';
import { CloudinaryModule } from '../../shared/cloudinary';
import { AdminImage } from './entities/admin-image.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, Admin, AdminImage]),
    CloudinaryModule,
    CaslModule,
    JwtTokenModule,
  ],
  controllers: [AdminsController],
  providers: [AdminsService],
})
export class AdminsModule {}
