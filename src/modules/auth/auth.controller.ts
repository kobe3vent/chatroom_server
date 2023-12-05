import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { User } from "modules/user/user.entity";
import { UserService } from "modules/user/user.service";

export interface AuthenticatedRequest extends Request {
  user: User;
}
@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  @Post("login")
  async userLogin(@Body() body: { email: string; password: string }) {
    return this.authService.login(body);
  }

  //TODO: logout

  // TODO:reset password

  // TODO: refresh token
}
