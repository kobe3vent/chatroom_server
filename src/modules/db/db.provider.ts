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
        models: [__dirname + "/../**/*.entity{.ts,.js}"],
        sync: {
          alter: true,
          hooks: true,
        },
        //logging : true
      });
      await dataSource.sync();
      return dataSource;
    },
  },
];
