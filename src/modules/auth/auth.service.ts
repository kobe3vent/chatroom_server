import { HttpException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { validateHash } from "helpers/utils";
import { UserService } from "modules/user/user.service";


@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService
  ) {}

  async login({
    email,
    password
  }: {email: string, password: string}): Promise<Record<string, any>> {

    const userDetails = await this.userService.findOne({ where : {email} });
    if (!userDetails) {
      throw new HttpException("Invalid credentials", 401);
    }

    // Check if the given password match with saved password
    const isValid = await validateHash(password, userDetails.password);
    return isValid ?
      {
        token: this.jwtService.sign({
          email: userDetails.email,
          sub: userDetails.id,
        
        },{
          expiresIn: '1h'
        }
        
        ),

        user: userDetails,
      } :  new HttpException("username or password not valid", 401);
    
  }
}
