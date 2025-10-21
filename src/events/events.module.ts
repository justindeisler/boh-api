import { Module } from '@nestjs/common';
import { EventsService } from '../application/services/events.service';
import { EventsPublicController } from '../presentation/controllers/events.public.controller';
import { EventsAdminController } from '../presentation/controllers/events.admin.controller';
import { DatabaseModule } from '../infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [EventsPublicController, EventsAdminController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
