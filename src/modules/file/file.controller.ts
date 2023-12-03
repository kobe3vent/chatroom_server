import {
  Controller,
  UseInterceptors,
  Get,
  Post,
  Param,
  Body,
  UploadedFile,
  Delete,
  UseGuards,
  Res,
  BadRequestException,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
} from "@nestjs/common";
import { Multer } from "multer";
import { FileService } from "./file.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";
import { File } from "./entities/file.entity";
import { RolesGuard } from "../../guards/roles.guard";
import { Roles } from "../../decorators/roles.decorator";
import { FileContentValidation } from "./validator/fileUploadValidation";
import { JwtAuthGuard } from "guards/jwt-auth.guard";
import { UserRole } from "constants/roles";
import { maxSizeFile } from "constants/misc";

@UseGuards(JwtAuthGuard)
@Controller("file")
export default class FileController {
  constructor(private readonly _fileService: FileService) {}

  @Post()
  @Roles(UserRole.USER)
  @UseGuards(RolesGuard)
  @UseInterceptors(FileInterceptor("file"))
  async create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: maxSizeFile }),
          new FileTypeValidator({
            fileType: /^(image\/jpeg|image\/png|application\/pdf)$/,
          }),
          new FileContentValidation({}),
        ],
      })
    )
    file: Multer.File
  ): Promise<File> {
    return this._fileService.create(file);
  }

  @Get(":id")
  @Roles(UserRole.USER, UserRole.SUPERADMIN)
  @UseGuards(RolesGuard)
  async download(@Res() res: Response, @Param("id") id: string): Promise<void> {
    try {
      const { file, encodedFile } = await this._fileService.download(id);
      res.type(file.contentType).send(encodedFile);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err);
    }
  }

  @Delete(":id")
  @Roles(UserRole.USER)
  @UseGuards(RolesGuard)
  delete(@Param("uuid") uuid: string): Promise<void> {
    return this._fileService.delete(uuid);
  }
}
