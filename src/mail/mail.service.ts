import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { User } from '../models/users';
import { QUEUE_NAME } from '../common/constants';

@Injectable()
export class MailService {
  constructor(
    @InjectQueue(QUEUE_NAME)
    private mailQueue: Queue,
  ) {}
  private readonly logger = new Logger(this.constructor.name);

  /** Send email welcome link to new user account. */
  async sendWelcomeEmail(user: User, dynamicOrigin: string): Promise<boolean> {
    try {
      await this.mailQueue.add('welcome', {
        user,
        dynamicOrigin,
      });
      return true;
    } catch (error) {
      this.logger.error(`Error queueing welcome email to user ${user.email}`);
      return false;
    }
  }

  async sendPasswordReset(user: User, resetToken: string): Promise<boolean> {
    try {
      await this.mailQueue.add('passwordReset', {
        user,
        resetToken,
      });
      return true;
    } catch (error) {
      this.logger.error(`Error queueing passwordReset to user ${user.email}`);
      return false;
    }
  }

  async sendPasswordChanged(
    user: User,
    dynamicOrigin: string,
  ): Promise<boolean> {
    try {
      await this.mailQueue.add('passwordChanged', {
        user,
        dynamicOrigin,
      });
      return true;
    } catch (error) {
      this.logger.error(`Error queueing passwordChanged to user ${user.email}`);
      return false;
    }
  }
}
