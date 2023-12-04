import { Message } from "modules/message/message.entity";
import { Room } from "modules/room/room.entity";
import { User } from "modules/user/user.entity";
import { File } from "modules/file/file.entity";
import { Model, ModelType } from "sequelize";
import { Sequelize } from "sequelize-typescript";

export const databaseProviders = [
  {
    provide: "SEQUELIZE",
    useFactory: async () => {
      const dataSource = new Sequelize({
        dialect: "mysql",
        host: process.env.MYSQL_HOST,
        port: 3306,
        username: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DB,
        //models: [__dirname + "/../**/*.entity{.ts}"],
        sync: {
          alter: true,
          hooks: true,
        },
        //logging: true,
      });
      dataSource.addModels([Message, Room, User, File]);
      await dataSource.sync();
      return dataSource;
    },
  },
];
