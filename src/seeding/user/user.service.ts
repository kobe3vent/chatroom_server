import { Injectable } from "@nestjs/common";
import { User } from "modules/user/user.entity";
import { Repository } from "typeorm";
import { getData } from "./data";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UserSeederService {
  constructor(
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>
  ) {}

  async createUsers(): Promise<User[]> {
    const userEntities = getData().map((userObj: User) =>
      this._userRepository.create(userObj)
    );

    return this._userRepository.save(userEntities);
  }
  async findUserAlpha(): Promise<User> {
    return this._userRepository.findOne({
      where: { email: process.env.USER_ALPHA },
    });
  }
}
