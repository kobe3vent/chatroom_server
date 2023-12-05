import { FileValidator } from "@nestjs/common";
import { Multer } from "multer";

export class FileContentValidation extends FileValidator {
  private FileHeaders = {
    "image/jpeg": "ffd8ff",
    "image/png": "89504e",
    "application/pdf": "255044",
  };

  isValid(file: Multer.File): boolean {
    const headerByte = file.buffer.toString("hex", 0, 3);
    return headerByte.includes(this.FileHeaders[file.mimetype]);
  }

  buildErrorMessage(file: Multer.File): string {
    return `Validation failed - Bad file (${file.mimetype}) type`;
  }
}
