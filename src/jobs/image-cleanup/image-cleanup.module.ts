import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ImageCleanupService } from './image-cleanup.service';
import { ImageCleanupScheduler } from './image-cleanup.scheduler';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [ImageCleanupService, ImageCleanupScheduler],
})
export class ImageCleanupModule {}
