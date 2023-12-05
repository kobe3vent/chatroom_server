import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppController } from "./app.controller";
import { UserModule } from "modules/user/user.module";
import { contextMiddleware } from "middlewares/context.middleware";
import { LoggerMiddleware } from "middlewares/logger.middleware";
import { DatabaseModule } from "modules/db/db.module";
import { AuthModule } from "modules/auth/auth.module";
import { RoomModule } from "modules/room/room.module";
import { MessageModule } from "modules/message/message.module";
import { SocketModule } from "modules/socket/socket.module";
import { FileModule } from "modules/file/file.module";

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UserModule,
    RoomModule,
    MessageModule,
    SocketModule,
    FileModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
    consumer.apply(LoggerMiddleware).forRoutes("*");
    consumer.apply(contextMiddleware).forRoutes("*");
  }
}
