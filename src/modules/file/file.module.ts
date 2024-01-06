import { Module } from "@nestjs/common";
import { FileService } from "modules/file/file.service";
import FileController from "./file.controller";
import { File } from "./entities/file.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([File])],
  controllers: [FileController],
  providers: [
    FileService,
  ],
  exports: [FileService],
})
export class FileModule {}
