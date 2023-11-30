import { NestFactory, Reflector } from '@nestjs/core';

import * as dot from 'dotenv'
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { ClassSerializerInterceptor, ValidationPipe, UnprocessableEntityException } from '@nestjs/common';
import { middleware as expressCtx } from 'express-ctx';
import { TypeOrmExceptionFilter } from 'helpers/exceptionHandler';

import { CrudConfigService } from '@rewiko/crud';
// Important: load config before (!!!) you import AppModule
CrudConfigService.load({
	query: {
		cache: 2000,
		maxLimit: 50,
		alwaysPaginate: true,
	},
	params: {
		id: {
			field: 'id',
			type: 'uuid',
			primary: true,
		},
	},
});

import { AppModule } from './modules/app/app.module';
dot.config();

async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(
		AppModule,
		new ExpressAdapter(),
		{ cors: true }
	);

	app.use(
		helmet({
			contentSecurityPolicy: false,
		})
	);

	const reflector = app.get(Reflector);
  
	app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
	app.useGlobalFilters(new TypeOrmExceptionFilter());

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			exceptionFactory: (errors): UnprocessableEntityException =>
				new UnprocessableEntityException(errors),
		})
	);


	app.use(expressCtx);

	// Starts listening for shutdown hooks
	if (process.env.NODE_ENV !== 'local') {
		app.enableShutdownHooks();
	}

	const port = process.env.PORT;
	await app.listen(port);

	console.log(`server running on port ${port}`);

	return app;
}

bootstrap();
