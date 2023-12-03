import { Injectable, NotFoundException, Inject } from "@nestjs/common";
import { File } from "./entities/file.entity";
//import { Base64Encode } from "base64-stream";
import { Multer } from "multer";
import { TypeOrmCrudService } from "@rewiko/crud-typeorm";
import { FILE_REPO } from "constants/repositories";
import { dirname } from "path";
import * as fs from "fs";

const APP_DIR = dirname(require.main.filename);
console.log("APP_DIR: ", APP_DIR);

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

  async create(file: Multer.File): Promise<File> {
    console.log("file: ", file);

    if (file) {
      const path = `${APP_DIR}/storage/${
        file.fieldname
      }_${new Date().getTime()}.${this.FILE_EXTENSIONS[file.mimetype]}`;

      try {
        fs.writeFileSync(path, file.buffer);
      } catch (e) {
        console.log("trouble writing to file: ", e);
      }

      return this.repo.save({
        key: path,
        name: file.originalname,
        contentType: file.mimetype,
      });
    }
  }

  async delete(id: string): Promise<void> {
    const file = await this.repo.findOne({ where: { id } });

    if (!file) {
      throw new NotFoundException();
    }

    //TODO: Remove from dossier

    // Remove from database
    await this.repo.remove(file);
  }

  async download(uuid: string): Promise<{ file: File; encodedFile: string }> {
    const file = await this.repo.findOne({ where: { id: uuid } });
    if (!file) {
      throw new NotFoundException(uuid);
    }

    //Reaad file from folder
    const data = "";

    //const encoded64: Buffer = await this.streamToBase64(data);

    return {
      file: file,
      encodedFile: "", //encoded64.toString("utf-8"),
    };
  }

  /*   private async streamToBase64(stream: Stream): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const cbConcat = (base64: Buffer): void => {
        resolve(base64);
      };

      stream
        .pipe(new Base64Encode())
        .pipe(concat(cbConcat))
        .on("error", (error) => {
          reject(error);
        });
    });
  } */
}
