import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PhotoCleanupService } from './image-cleanup.service';
import { PhotoCleanupScheduler } from './image-cleanup.scheduler';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [PhotoCleanupService, PhotoCleanupScheduler],
})
export class PhotoCleanupModule {}
