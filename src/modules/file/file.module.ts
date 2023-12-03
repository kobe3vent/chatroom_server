import { Module } from "@nestjs/common";
import { FileService } from "modules/file/file.service";
import FileController from "./file.controller";
import { FILE_REPO } from "constants/repositories";
import { DatabaseModule } from "modules/db/db.module";
import { File } from "./file.entity";

@Module({
  imports: [DatabaseModule],
  controllers: [FileController],
  providers: [
    {
      provide: FILE_REPO,
      useValue: File,
    },
    FileService,
  ],
  exports: [FileService],
})
export class FileModule {}
