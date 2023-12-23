import { MailerService } from '@nestjs-modules/mailer';
import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Inject, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Job } from 'bull';

import { plainToInstance } from 'class-transformer';
import { AppConfig } from '../config/app';
import { User } from '../models/users';
import { QUEUE_NAME, mailLive } from '../common/constants';

@Processor(QUEUE_NAME)
export class MailProcessor {
  constructor(
    @Inject(AppConfig.KEY) private appConfig: ConfigType<typeof AppConfig>,
    private readonly mailerService: MailerService,
    private readonly logger: Logger,
  ) {}

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.debug(
      `Processing job ${job.id} of type ${job.name}. Data: ${JSON.stringify(
        job.data,
      )}`,
    );
  }

  @OnQueueCompleted()
  onComplete(job: Job, result: any) {
    this.logger.debug(
      `Completed job ${job.id} of type ${job.name}. Result: ${JSON.stringify(
        result,
      )}`,
    );
  }

  @OnQueueFailed()
  onError(job: Job<any>, error: any) {
    this.logger.error(
      `Failed job ${job.id} of type ${job.name}: ${error.message}`,
      error.stack,
    );
  }

  @Process('welcome')
  async sendWelcomeEmail(job: Job<{ user: User }>): Promise<any> {
    this.logger.log(`Sending welcome email to '${job.data.user.email}'`);

    const url = `${this.appConfig.server_origin}`;

    console.log(plainToInstance(User, job.data.user));
    if (mailLive) {
      return 'SENT MOCK CONFIRMATION EMAIL';
    }
    try {
      const result = await this.mailerService.sendMail({
        template: 'welcome',
        context: {
          name: job.data.user.name,
          url,
          appName: this.appConfig.name,
        },
        subject: `Welcome to ${this.appConfig.name} Dear ${job.data.user.name}`,
        to: job.data.user.email,
      });
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to send welcome email to '${job.data.user.email}'`,
        error.stack,
      );
      throw error;
    }
  }
  // ...
}
