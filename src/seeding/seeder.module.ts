import { Module } from "@nestjs/common";
import SeederService from "./seeder.service";
import { UserSeederModule } from "./user/user.module";
import { DatabaseModule } from "modules/db/db.module";

@Module({
  imports: [DatabaseModule, UserSeederModule],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
