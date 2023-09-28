import { Logger, Module } from '@nestjs/common';
import { PermissionsSeederModule } from './permissions/permissions.module';
import { DatabaseModule } from '../../providers/database/database.module';
import { Seeder } from './seeder';
import { ConfigModule } from '@nestjs/config';
import { SuperadminModule } from './superadmin/superadmin.module';
import Joi = require('@hapi/joi');
import { RolesSeederModule } from './roles/roles.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        ENV: Joi.string().required(),
        JWT_SECRET: Joi.string(),
        JWT_EXPIRES_IN: Joi.string(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASS: Joi.string().required(),
        POSTGRES_NAME: Joi.string().required(),
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
      }),
      // load: [postgresConfig],
    }),
    DatabaseModule,
    PermissionsSeederModule,
    SuperadminModule,
    RolesSeederModule,
  ],
  providers: [Logger, Seeder],
})
export class SeederModule {}
