import { HttpException, HttpStatus } from '@nestjs/common';

export class DuplicateKeyException extends HttpException {
	public data: any;

	constructor(data: any) {
		super(
			HttpException.createBody({ message: 'Duplicate Key Exception', data }),
			HttpStatus.INTERNAL_SERVER_ERROR
		);
		this.data = data;
	}
}
