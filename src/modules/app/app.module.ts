import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from 'modules/user/user.module';
import { contextMiddleware } from 'middlewares/context.middleware';
import { LoggerMiddleware } from 'middlewares/logger.middleware';
import { DatabaseModule } from 'modules/db/db.module';

@Module({
  imports: [
   // DatabaseModule,
    UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
		consumer.apply(LoggerMiddleware).forRoutes('*');
		consumer.apply(contextMiddleware).forRoutes('*');
	}
}
