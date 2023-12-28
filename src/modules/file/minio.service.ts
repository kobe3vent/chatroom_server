import * as Minio from "minio";
import { Multer } from "multer";
import { File } from "./entities/file.entity";

const FILE_EXTENSIONS = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "application/pdf": "pdf",
};

export const uploadToMinio = async (
  file: Multer.File
): Promise<{ name: string; etag: string; versionId: string }> => {
  //TODO replace null too with underscore . use regex
  const fileName = `${file.originalname.replace(
    " ",
    "_"
  )}_${new Date().getTime()}.${FILE_EXTENSIONS[file.mimetype]}`;

  const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_HOST,
    port: parseInt(process.env.MINIO_PORT),
    useSSL: false,
    accessKey: process.env.MINIO_ACCESSKEY,
    secretKey: process.env.MINIO_SECRETKEY,
  });

  return new Promise((resolve, reject) => {
    minioClient.putObject(
      process.env.MINIO_BUCKET,
      fileName,
      file.buffer,
      file.size,
      function (err, objInfo) {
        if (err) {
          console.log("trouble writing to file: ", err);
          return reject(new Error(JSON.stringify(err)));
        }
        console.log("Success", objInfo);
        const data = { ...objInfo, name: fileName };
        return resolve(data);
      }
    );
  });
};

export const getFromMinio = async (file: File): Promise<string> => {
  const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_HOST,
    port: parseInt(process.env.MINIO_PORT),
    useSSL: false,
    accessKey: process.env.MINIO_ACCESSKEY,
    secretKey: process.env.MINIO_SECRETKEY,
  });

  return new Promise((resolve, reject) => {
    let fileContent = "";
    minioClient.getObject(
      process.env.MINIO_BUCKET,
      file.name,
      function (err, dataStream) {
        if (err) {
          return console.log(err);
        }
        dataStream.on("data", (chunk) => (fileContent += chunk));

        dataStream.on("end", () => resolve(fileContent));

        dataStream.on("error", (err) => {
          console.error("streaming minio error: ", err);
          return reject(err);
        });
      }
    );
  });
};

export const removeFromMinio = async (file: File): Promise<void> => {
  const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_HOST,
    port: parseInt(process.env.MINIO_PORT),
    useSSL: false,
    accessKey: process.env.MINIO_ACCESSKEY,
    secretKey: process.env.MINIO_SECRETKEY,
  });

  return minioClient.removeObject(process.env.MINIO_BUCKET, file.name);
};
