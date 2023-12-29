import {
  Injectable,
  NotFoundException,
  Inject,
  HttpException,
  HttpStatus,
  ForbiddenException,
} from "@nestjs/common";
import { File } from "./entities/file.entity";
import { Multer } from "multer";
import { TypeOrmCrudService } from "@rewiko/crud-typeorm";
import { FILE_REPO } from "constants/repositories";
import { User } from "modules/user/user.entity";
import { getFromMinio, removeFromMinio, uploadToMinio } from "./minio.service";

@Injectable()
export class FileService extends TypeOrmCrudService<File> {
  private FILE_EXTENSIONS = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "application/pdf": "pdf",
  };
  constructor(@Inject(FILE_REPO) repo) {
    super(repo);
  }

  async create(file: Multer.File): Promise<Partial<File>> {
    if (!file) return;

    try {
      const uploadedFile = await uploadToMinio(file);
      const savedFile = await this.repo.save({
        key: uploadedFile.etag,
        name: uploadedFile.name,
        contentType: file.mimetype,
      });

      return savedFile;
    } catch (err) {
      console.error("trouble saving to file: ", err);
      throw new HttpException(
        "Trouble saving file",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async delete(id: string): Promise<File> {
    const file = await this.repo.findOne({ where: { id } });
    if (!file) throw new NotFoundException();

    await removeFromMinio(file);

    return this.repo.remove(file);
  }

  async download(
    id: string,
    user: User
  ): Promise<{ meta: Partial<File>; encodedFile: string }> {
    const file = await this.repo.findOne({
      where: { id },
      relations: ["message.author"],
    });
    if (!file) throw new NotFoundException();

    if (file.message.author.id !== user.id)
      throw new ForbiddenException("You did not post this file");

    try {
      const url = await getFromMinio(file);

      return {
        meta: file,
        encodedFile: url,
      };
    } catch (e) {
      console.error("trouble reading file: ", e);
      throw new HttpException(
        "trouble reading file",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
