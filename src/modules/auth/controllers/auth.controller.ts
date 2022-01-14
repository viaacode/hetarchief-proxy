import { Controller, Get } from '@nestjs/common';

@Controller('auth')
export class AuthController {
	@Get()
	public logout(): string {
		return 'OK';
	}
}
