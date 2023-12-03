import { Model } from "sequelize";
import {
  Column,
  CreatedAt,
  DataType,
  Default,
  DeletedAt,
  IsUUID,
  PrimaryKey,
  UpdatedAt,
} from "sequelize-typescript";

export abstract class AbstractEntity extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  // @Exclude()
  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}
