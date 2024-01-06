import { Module } from "@nestjs/common";
import SeederService from "./seeder.service";
import { UserSeederModule } from "./user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [ TypeOrmModule.forRootAsync({
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
  }), UserSeederModule],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
