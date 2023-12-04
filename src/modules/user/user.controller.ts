import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { Crud, CrudController } from "@rewiko/crud";
import { RestCrudGuard } from "guards/roles.guard";
import { UserRole } from "constants/roles";
import { JwtAuthGuard } from "guards/jwt-auth.guard";
import { AuthUser } from "decorators/auth-user.decorator";
import { User } from "./user.entity";
import { Op } from "sequelize";
/*
@Crud({
  model: {
    type: User,
  },
  query: {
    join: {
      rooms: {
        eager: true,
      },
    },
  },
  routes: {
    exclude: ["createManyBase", "replaceOneBase"],
  },
})
*/
/*
@UseGuards(
  JwtAuthGuard
 
  new RestCrudGuard({
    "Read-One": [UserRole.USER, UserRole.SUPERADMIN],
    "Read-All": [UserRole.SUPERADMIN, UserRole.USER],
    "Create-One": [UserRole.ALL],
    "Create-Many": [],
    "Update-One": [UserRole.USER, UserRole.SUPERADMIN],
    "Replace-One": [],
    "Delete-One": [UserRole.USER, UserRole.SUPERADMIN],
  })
)
*/
@Controller("user")
export class UserController {
  constructor(public service: UserService) {}

  @Get("me")
  async me(@AuthUser() user: User) {
    return this.service.findOneById(user.id);
  }

  @Post() //TODO: Validate inputs
  async create(@Body() body) {
    return this.service.createOne(body);
  }

  @Get()
  async getAllUsers(@Query("s") q: string) {
    const instances = await User.findAll({
      where: {
        email: {
          [Op.substring]: q,
        },
      },
    });

    const results = instances.map((i) => {
      const temp = i.toJSON() as User;

      const { password, ...clone } = temp;
      return clone;
    });

    return results;
  }
}

//TODO: implement overide PATCH && DELETE route to only allow user to patch his object
