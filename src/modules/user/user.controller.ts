import { Controller, } from '@nestjs/common';
import { UserService } from './user.service';
import { CrudController } from '@nestjsx/crud';
import { User } from './user.entity';

@Controller('user')
export class UserController implements CrudController<User> {
  constructor(public service: UserService) {}
}
