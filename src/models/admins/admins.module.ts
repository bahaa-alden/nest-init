import { Module } from '@nestjs/common';
import { AdminsController } from './admins.controller';
import { CaslModule } from '../../shared/casl/casl.module';
import { AdminsService } from './admins.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { Role } from '../roles/entities/role.entity';
import { JwtTokenModule } from '../../shared/jwt/jwt-token.module';

@Module({
  imports: [
    CaslModule,
    TypeOrmModule.forFeature([Admin, Role]),
    JwtTokenModule,
  ],
  controllers: [AdminsController],
  providers: [AdminsService],
})
export class AdminsModule {}
