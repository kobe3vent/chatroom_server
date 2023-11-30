import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { DATA_SOURCE, MESSAGE_REPO } from 'constants/repositories';
import { DatabaseModule } from 'modules/db/db.module';
import { DataSource } from 'typeorm';
import { Message } from './message.entity';

@Module({
  imports: [DatabaseModule],
  controllers: [MessageController],
  providers: [
    {
      provide: MESSAGE_REPO,
      useFactory: (dataSource: DataSource) => dataSource.getRepository(Message),
      inject: [DATA_SOURCE],
    }, 
    MessageService
  ],
  exports: [MessageService]
})
export class MessageModule {}
