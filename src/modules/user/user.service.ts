import { HttpException, Inject, Injectable } from "@nestjs/common";
import { USER_REPO } from "constants/repositories";
import { User } from "./user.entity";
import { Op } from "sequelize";

@Injectable()
export class UserService {
  constructor(@Inject(USER_REPO) private repo: typeof User) {
    this.repo.sync();
  }

  async findOneById(id: string) {
    return this.repo.findOne({ where: { id } });
  }
  async findOneByEmail(email: string) {
    const instance = await this.repo.findOne({ where: { email: email } });

    console.log("userObj: ", instance);
    return instance.toJSON() as User;
  }

  async findManyByEmail(email: string) {
    const foundInstaces = await this.repo.findAll({
      where: {
        email: {
          [Op.substring]: email,
        },
      },
    });

    const results = foundInstaces.map((i) => {
      const temp = i.toJSON() as User;

      const { password, ...clone } = temp;
      return clone;
    });

    return results;
  }

  async createOne(dto) {
    try {
      const instance = await this.repo.create(dto);
      const obj = instance.toJSON() as User;
      const { password, ...clone } = obj;
      console.log("userObj: ", clone);

      return clone;
    } catch (err) {
      console.log("create: ", err);
      throw new HttpException("cant create", 400);
    }
  }
}
