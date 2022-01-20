import { Controller, Get } from '@nestjs/common';

import { LoginResponse } from '../types';

@Controller('auth')
export class AuthController {
	@Get('check-login')
	public checkLogin(): LoginResponse {
		return { message: 'LOGGED_OUT' };
	}
}
