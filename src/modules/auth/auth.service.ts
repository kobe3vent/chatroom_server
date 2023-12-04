import { HttpException, Injectable, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { validateHash } from "helpers/utils";
import { User } from "modules/user/user.entity";
import { UserService } from "modules/user/user.service";
import { Op } from "sequelize";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService
  ) {}

  async login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<Record<string, any>> {
    const instance = await User.findOne({
      where: {
        email: {
          [Op.endsWith]: email,
        },
      },
    });
    if (!instance) throw new HttpException("Invalid credentials", 401);

    const userDetails = instance.toJSON() as User;

    // Check if the given password match with saved password
    const isValid = await validateHash(password, userDetails.password);
    delete userDetails.password;

    return isValid
      ? {
          token: this.jwtService.sign(
            {
              email: userDetails.email,
              sub: userDetails.id,
            },
            {
              expiresIn: "1h",
            }
          ),

          user: userDetails,
        }
      : new HttpException("username or password not valid", 401);
  }
}
