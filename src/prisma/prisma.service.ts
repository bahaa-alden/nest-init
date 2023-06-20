import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  // i don't put this inside constructor before the config because i will use it inside of super
  //and super must be called before using this
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: { url: config.get('DATABASE_URL') },
      },
    });
  }
  cleanDb() {
    return this.$transaction([this.user.deleteMany()]);
  }
}
