import { Injectable } from "@nestjs/common";
import { UserSeederService } from "./user/user.service";

@Injectable()
export default class SeederService {
  constructor(private readonly _userSeederService: UserSeederService) {}

  async seed_alpha_users(): Promise<void> {
    const existing_users = await this._userSeederService.findUserAlpha();
    if (!existing_users) {
      await this._userSeederService.createUsers();
      console.log("alpha users seeded");
    }
  }
}
