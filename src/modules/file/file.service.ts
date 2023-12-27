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
import { User } from "modules/user/user.entity";
import * as Minio from "minio";

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
    const minioClient = new Minio.Client({
      endPoint: process.env.MINIO_HOST,
      port: parseInt(process.env.MINIO_PORT),
      useSSL: false,
      accessKey: process.env.MINIO_ACCESSKEY,
      secretKey: process.env.MINIO_SECRETKEY,
    });

    if (file) {
      //TODO replace null too with underscore . use regex
      const fileName = `${file.originalname.replace(
        " ",
        "_"
      )}_${new Date().getTime()}.${this.FILE_EXTENSIONS[file.mimetype]}`;

      minioClient.putObject(
        process.env.MINIO_BUCKET,
        fileName,
        file.buffer,
        file.size,
        function (err, objInfo) {
          if (err) {
            console.log("trouble writing to file: ", err);
            throw new HttpException("Error saving file", 500);
          }
          console.log("Success", objInfo);
        }
      );
      const savedFile = await this.repo.save({
        key: fileName, // objInfo.etag,
        name: fileName,
        contentType: file.mimetype,
      });

      return savedFile;
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
    const minioClient = new Minio.Client({
      endPoint: process.env.MINIO_HOST,
      port: parseInt(process.env.MINIO_PORT),
      useSSL: false,
      accessKey: process.env.MINIO_ACCESSKEY,
      secretKey: process.env.MINIO_SECRETKEY,
    });

    const file = await this.repo.findOne({
      where: { id },
      relations: ["message.author"],
    });
    if (!file) throw new NotFoundException();

    // TO DO: uncomment
    //if (file.message.author.id !== user.id)
    //  throw new ForbiddenException("You did not post this file");

    const { key, ...publicInfo } = file;

    try {
      //const fileBase64 = fs.readFileSync(file.key).toString("base64");
      minioClient.getObject(
        process.env.MINIO_BUCKET,
        file.name,
        function (err, dataStream) {
          if (err) {
            return console.log(err);
          }
          dataStream.on("data", function (chunk) {
            console.log(" chunck : ", chunk);
          });
        }
      );

      return {
        meta: publicInfo,
        encodedFile: "fileBase64",
      };
    } catch (e) {
      console.log("trouble reading file: ", e);
      throw new HttpException("File not found", 404);
    }
  }
}
