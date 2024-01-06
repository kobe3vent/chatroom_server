import { Module } from "@nestjs/common";
import { MessageService } from "./message.service";
import { MessageController } from "./message.controller";
import { Message } from "./message.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoomModule } from "modules/room/room.module";

@Module({
  imports: [TypeOrmModule.forFeature([Message]), RoomModule],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
