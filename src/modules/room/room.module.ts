import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { DatabaseModule } from 'modules/db/db.module';
import { DATA_SOURCE, ROOM_REPO } from 'constants/repositories';
import { DataSource } from 'typeorm';
import { Room } from './room.entity';

@Module({
  imports: [DatabaseModule],
  controllers: [RoomController],
  providers: [
    {
      provide: ROOM_REPO,
      useFactory: (dataSource: DataSource) => dataSource.getRepository(Room),
      inject: [DATA_SOURCE],
    }, 
    RoomService],
    exports: [RoomService]
})
export class RoomModule {}
