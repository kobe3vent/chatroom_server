import { Inject, Injectable } from "@nestjs/common";
import { User } from "modules/user/user.entity";
import { Repository } from "typeorm";
import { getData } from "./data";
import { USER_REPO } from "constants/repositories";

@Injectable()
export class UserSeederService {
  constructor(
    @Inject(USER_REPO)
    private readonly _userRepository: Repository<User>
  ) {}

  async createUsers(): Promise<User[]> {
    return this._userRepository.save(getData());
  }
  async findUserAlpha(): Promise<User> {
    return this._userRepository.findOne({
      where: { email: process.env.USER_ALPHA },
    });
  }
}
