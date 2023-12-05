import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { DatabaseModule } from 'modules/db/db.module';
import { DataSource } from 'typeorm';
import { DATA_SOURCE, USER_REPO } from 'constants/repositories';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [ 
    {
    provide: USER_REPO,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: [DATA_SOURCE],
  }, 
  UserService],
  exports: [UserService],
})
export class UserModule {}
