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
import { AppService } from "./app.service";
import { SeederModule } from "seeding/seeder.module";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [],
      useFactory: () => {
        const entities = [__dirname + "/../../modules/**/*.entity{.ts,.js}"];

        return {
          type: "postgres",
          host: process.env.POSTGRES_HOST,
          port: parseInt(process.env.POSTGRES_PORT),
          username: process.env.POSTGRES_USER,
          password: process.env.POSTGRES_PASSWORD,
          database: process.env.POSTGRES_DATABASE,
          entities,
          migrationsTableName: "migration",
          //migrations: ['src/migration/*.ts'],
          synchronize: true,
          //ssl: this.isProduction(),
        };
      },
      inject: [],
    }),
    AuthModule,
    UserModule,
    RoomModule,
    MessageModule,
    SocketModule,
    FileModule,
    SeederModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
    consumer.apply(LoggerMiddleware).forRoutes("*");
    consumer.apply(contextMiddleware).forRoutes("*");
  }
}
