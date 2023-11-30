import { Inject, Injectable } from '@nestjs/common';
import { Room } from './room.entity';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { ROOM_REPO } from 'constants/repositories';

@Injectable()
export class RoomService extends TypeOrmCrudService<Room> {
    constructor(@Inject(ROOM_REPO) repo) {
          super(repo);
      }
  
  }
