import { Module } from "@nestjs/common";
import { FileService } from "modules/file/file.service";
import FileController from "./file.controller";
import { FILE_REPO, DATA_SOURCE } from "constants/repositories";
import { DatabaseModule } from "modules/db/db.module";
import { Message } from "modules/message/message.entity";
import { DataSource } from "typeorm";
import { File } from "./entities/file.entity";

@Module({
  imports: [DatabaseModule],
  controllers: [FileController],
  providers: [
    {
      provide: FILE_REPO,
      useFactory: (dataSource: DataSource) => dataSource.getRepository(File),
      inject: [DATA_SOURCE],
    },
    FileService,
  ],
  exports: [FileService],
})
export class FileModule {}
