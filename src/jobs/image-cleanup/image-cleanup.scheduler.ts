import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ImageCleanupService } from './image-cleanup.service';

@Injectable()
export class ImageCleanupScheduler {
  constructor(private readonly imageCleanupService: ImageCleanupService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleFileCleanup() {
    try {
      await this.imageCleanupService.deleteImagesOlderThanDays();
      Logger.log(`Image cleanup completed for 1 days.`, 'ImageCleanupService');
    } catch (error) {
      Logger.error(
        `Error occurred during file cleanup: ${error}`,
        'ImageCleanupService',
      );
    }
  }
}
