import { Module } from "@nestjs/common";
import { MessageService } from "./message.service";
import { MessageController } from "./message.controller";
import { MESSAGE_REPO } from "constants/repositories";
import { DatabaseModule } from "modules/db/db.module";
import { Message } from "./message.entity";

@Module({
  imports: [DatabaseModule],
  controllers: [MessageController],
  providers: [
    {
      provide: MESSAGE_REPO,
      useValue: Message,
    },
    MessageService,
  ],
  exports: [MessageService],
})
export class MessageModule {}
