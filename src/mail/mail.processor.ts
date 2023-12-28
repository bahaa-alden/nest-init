// Import necessary modules and dependencies
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

// Import utility functions and configurations
import { plainToInstance } from 'class-transformer';
import { AppConfig } from '../config/app';
import { User } from '../models/users';
import { QUEUE_NAME, mailLive } from '../common/constants';
import MailConfig from '../config/mail';

// Decorate the class as a processor for the specified queue
@Processor(QUEUE_NAME)
export class MailProcessor {
  // Constructor to inject configuration and mailer service
  constructor(
    @Inject(AppConfig.KEY) private appConfig: ConfigType<typeof AppConfig>,
    @Inject(MailConfig.KEY) private mailConfig: ConfigType<typeof MailConfig>,

    private readonly mailerService: MailerService,
  ) {}

  // Logger instance for logging messages
  private readonly logger = new Logger(this.constructor.name);

  // Event handler for when a job in the queue becomes active
  @OnQueueActive()
  onActive(job: Job) {
    this.logger.debug(
      `Processing job ${job.id} of type ${job.name}. Data: ${JSON.stringify(
        job.data,
      )}`,
    );
  }

  // Event handler for when a job in the queue is completed
  @OnQueueCompleted()
  onComplete(job: Job, result: any) {
    this.logger.debug(
      `Completed job ${job.id} of type ${job.name}. Result: ${JSON.stringify(
        result,
      )}`,
    );
  }

  // Event handler for when a job in the queue fails
  @OnQueueFailed()
  onError(job: Job<any>, error: any) {
    this.logger.error(
      `Failed job ${job.id} of type ${job.name}: ${error.message}`,
      error.stack,
    );
  }

  // Process decorator for handling jobs of type 'welcome'
  @Process('welcome')
  async sendWelcomeEmail(
    job: Job<{ user: User; dynamicOrigin: string }>,
  ): Promise<any> {
    // Log the initiation of sending a welcome email
    this.logger.log(`Sending welcome email to '${job.data.user.email}'`);

    // Construct the URL for the email content
    const url = `${job.data.dynamicOrigin}`;

    // If in a live environment, return a mock confirmation message
    if (mailLive) {
      return 'SENT MOCK CONFIRMATION EMAIL';
    }

    try {
      // Send the welcome email using the mailer service
      const result = await this.mailerService.sendMail({
        template: 'welcome',
        context: {
          name: job.data.user.name,
          url,
          appName: this.appConfig.name,
        },
        subject: `Welcome to ${this.appConfig.name} Dear ${job.data.user.name}`,
        to: job.data.user.email,
        from: this.mailConfig.from,
      });
      return result;
    } catch (error) {
      // Log an error if the email sending fails and propagate the error
      this.logger.error(
        `Failed to send welcome email to '${job.data.user.email}'`,
        error.stack,
      );
      throw error;
    }
  }

  // Process decorator for handling jobs of type 'welcome'
  @Process('passwordReset')
  async sendPasswordReset(
    job: Job<{ user: User; resetToken: string }>,
  ): Promise<any> {
    // Log the initiation of sending a reset password email
    this.logger.log(`Sending password reset token to '${job.data.user.email}'`);

    // If in a live environment, return a mock confirmation message
    if (mailLive) {
      return 'SENT MOCK CONFIRMATION EMAIL';
    }

    try {
      // Send the reset password token using the mailer service
      const result = await this.mailerService.sendMail({
        template: 'passwordReset',
        context: {
          name: job.data.user.name,
          resetToken: job.data.resetToken,
        },
        subject: 'Your reset token valid for only 10 minute',
        to: job.data.user.email,
        from: this.mailConfig.from,
      });
      return result;
    } catch (error) {
      // Log an error if the email sending fails and propagate the error
      this.logger.error(
        `Failed to send password reset token to '${job.data.user.email}'`,
        error.stack,
      );
      throw error;
    }
  }

  @Process('passwordChanged')
  async sendPasswordChanged(
    job: Job<{ user: User; dynamicOrigin: string }>,
  ): Promise<any> {
    // Log the initiation of sending a password changed email
    this.logger.log(
      `Sending password changed message to '${job.data.user.email}'`,
    );

    // If in a live environment, return a mock confirmation message
    if (mailLive) {
      return 'SENT MOCK CONFIRMATION EMAIL';
    }

    try {
      // Send the password changed message using the mailer service
      const result = await this.mailerService.sendMail({
        template: 'passwordChanged',
        context: {
          name: job.data.user.name,
          url: job.data.dynamicOrigin,
          appName: this.appConfig.name,
        },
        subject: 'Your password has been reset',
        to: job.data.user.email,
        from: this.mailConfig.from,
      });
      return result;
    } catch (error) {
      // Log an error if the email sending fails and propagate the error
      this.logger.error(
        `Failed to send password changed message to '${job.data.user.email}'`,
        error.stack,
      );
      throw error;
    }
  }
  // Additional methods for handling other types of jobs can be added here
  // ...
}
