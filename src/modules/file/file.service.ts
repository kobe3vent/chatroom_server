import {
  Injectable,
  NotFoundException,
  Inject,
  HttpException,
  ForbiddenException,
} from "@nestjs/common";
import { File } from "./entities/file.entity";
import { Multer } from "multer";
import { TypeOrmCrudService } from "@rewiko/crud-typeorm";
import { FILE_REPO } from "constants/repositories";
import { dirname } from "path";
import * as fs from "fs";
import { User } from "modules/user/user.entity";

const APP_DIR = dirname(require.main.filename);

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
    if (file) {
      const path = `${APP_DIR}/../storage/${
        file.fieldname
      }_${new Date().getTime()}.${this.FILE_EXTENSIONS[file.mimetype]}`;

      try {
        fs.writeFileSync(path, file.buffer);
      } catch (e) {
        console.log("trouble writing to file: ", e);
      }

      const savedFile = await this.repo.save({
        key: path,
        name: file.originalname,
        contentType: file.mimetype,
      });

      const { key, ...clone } = savedFile;
      return clone;
    }
  }

  async delete(id: string): Promise<void> {
    const file = await this.repo.findOne({ where: { id } });
    if (!file) throw new NotFoundException();

    //TODO: Remove from dossier

    // Remove from database
    await this.repo.remove(file);
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

    const { key, ...publicInfo } = file;

    try {
      const fileBase64 = fs.readFileSync(file.key).toString("base64");

      return {
        meta: publicInfo,
        encodedFile: fileBase64,
      };
    } catch (e) {
      console.log("trouble reading file: ", e);
      throw new HttpException("File not found", 404);
    }
  }
}
