import {
  Controller,
  UseInterceptors,
  Get,
  Post,
  Param,
  UploadedFile,
  Delete,
  UseGuards,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
} from "@nestjs/common";
import { Multer } from "multer";
import { FileService } from "./file.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { File } from "./entities/file.entity";
import { RolesGuard } from "../../guards/roles.guard";
import { Roles } from "../../decorators/roles.decorator";
import { FileContentValidation } from "./validator/fileUploadValidation";
import { JwtAuthGuard } from "guards/jwt-auth.guard";
import { UserRole } from "constants/roles";
import { maxSizeFile } from "constants/misc";
import { AuthUser } from "decorators/auth-user.decorator";
import { User } from "modules/user/user.entity";

@UseGuards(JwtAuthGuard)
@Roles(UserRole.USER)
@UseGuards(RolesGuard)
@Controller("file")
export default class FileController {
  constructor(private readonly _fileService: FileService) {}

  @Post()
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
  ): Promise<Partial<File>> {
    return this._fileService.create(file);
  }

  @Get(":id")
  async download(
    @Param("id") id: string,
    @AuthUser() user: User
  ): Promise<{ meta: Partial<File>; encodedFile: string }> {
    return this._fileService.download(id, user);
  }

  @Delete(":id")
  delete(@Param("id") uuid: string): Promise<void> {
    return this._fileService.delete(uuid);
  }
}
