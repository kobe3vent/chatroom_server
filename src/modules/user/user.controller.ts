import { Controller, Get, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { Crud, CrudController } from "@rewiko/crud";
import { User } from "./user.entity";
import { RestCrudGuard } from "guards/roles.guard";
import { UserRole } from "constants/roles";
import { JwtAuthGuard } from "guards/jwt-auth.guard";
import { AuthUser } from "decorators/auth-user.decorator";

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
    exclude: ["password"],
  },
  routes: {
    exclude: ["createManyBase", "replaceOneBase"],
  },
})
@UseGuards(
  new RestCrudGuard({
    "Read-One": [UserRole.USER, UserRole.SUPERADMIN],
    "Read-All": [UserRole.ALL],
    "Create-One": [UserRole.ALL],
    "Create-Many": [],
    "Update-One": [UserRole.USER, UserRole.SUPERADMIN],
    "Replace-One": [],
    "Delete-One": [UserRole.USER, UserRole.SUPERADMIN],
  })
)
@Controller("user")
export class UserController implements CrudController<User> {
  constructor(public service: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get("me")
  async me(@AuthUser() user: User) {
    return this.service.findOne({
      where: { id: user.id },
      relations: ["rooms"],
    });
  }
}

//TODO: implement overide PATCH && DELETE route to only allow user to patch his object
