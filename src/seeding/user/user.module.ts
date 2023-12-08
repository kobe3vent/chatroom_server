import { Module } from "@nestjs/common";
import { User } from "modules/user/user.entity";
import { UserModule } from "modules/user/user.module";
import { UserSeederService } from "./user.service";
import { USER_REPO, DATA_SOURCE } from "constants/repositories";
import { DatabaseModule } from "modules/db/db.module";
import { DataSource } from "typeorm";

@Module({
  imports: [DatabaseModule, UserModule],
  providers: [
    {
      provide: USER_REPO,
      useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
      inject: [DATA_SOURCE],
    },
    UserSeederService,
  ],
  exports: [UserSeederService],
})
export class UserSeederModule {}
