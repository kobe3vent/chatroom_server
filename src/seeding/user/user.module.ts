import { Module } from "@nestjs/common";
import { User } from "modules/user/user.entity";
import { UserModule } from "modules/user/user.module";
import { UserSeederService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([User]), UserModule],
  providers: [
    UserSeederService,
  ],
  exports: [UserSeederService],
})
export class UserSeederModule {}
