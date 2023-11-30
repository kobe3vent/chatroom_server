import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";

import { AuthService } from "../auth.service";
import { User } from "modules/user/user.entity";
import { UserService } from "modules/user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private userservice: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      algorithms: ["RS256"],
    });
  }

  /**
   * @description Validate the token and return the user
   * @param payload string
   * @returns User
   */
  async validate(payload: any): Promise<User> {
    // Accept the JWT and attempt to validate it using the user service
    const user = await this.userservice.findOne({ where: { email: payload.email} });

    // If the user is not found, throw an error
    if (!user) {
      throw new HttpException("Invalid user", HttpStatus.UNAUTHORIZED);
    }

    // If the user is found, return the user
    return user;
  }
}
