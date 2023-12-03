import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { User } from "./user.entity";
import { DatabaseModule } from "modules/db/db.module";
import { USER_REPO } from "constants/repositories";

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [
    {
      provide: USER_REPO,
      useValue: User,
    },
    UserService,
  ],
  exports: [UserService],
})
export class UserModule {}
