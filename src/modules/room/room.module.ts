import { Module } from "@nestjs/common";
import { RoomService } from "./room.service";
import { RoomController } from "./room.controller";
import { DatabaseModule } from "modules/db/db.module";
import { ROOM_REPO } from "constants/repositories";
import { Room } from "./room.entity";

@Module({
  imports: [DatabaseModule],
  controllers: [RoomController],
  providers: [
    {
      provide: ROOM_REPO,
      useValue: Room,
    },
    RoomService,
  ],
  exports: [RoomService],
})
export class RoomModule {}
