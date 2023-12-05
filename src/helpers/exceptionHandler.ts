import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { TypeORMError } from 'typeorm';

@Catch(TypeORMError)
export class TypeOrmExceptionFilter implements ExceptionFilter {
	catch(exception: TypeORMError, host: ArgumentsHost): any {
		const response = host.switchToHttp().getResponse();
		const message: string = (exception as any).detail || (exception as any).message;
		const code: number = (exception as any).code;
		const customResponse = {
			status: 400,
			errors: { code: code, message: message },
			timestamp: new Date().toISOString(),
		};

		console.error('TypeORM error : ', JSON.stringify(customResponse, null, 2));
		return response.status(customResponse.status).json(customResponse);
	}
}
