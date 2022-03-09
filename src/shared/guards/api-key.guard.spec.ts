import { ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Configuration } from '~config';

import { API_KEY_EXCEPTION, ApiKeyGuard } from '~shared/guards/api-key.guard';

const mockApiKey = 'MySecretApiKey';

const mockConfigService: ConfigService = {
	get: jest.fn((key: keyof Configuration): string | boolean => {
		if (key === 'proxyApiKey') {
			return mockApiKey;
		}
		return key;
	}),
} as Partial<Record<keyof ConfigService, jest.SpyInstance>> as unknown as ConfigService;

const mockExecutionContextCorrect = {
	switchToHttp: jest.fn().mockReturnValue({
		getRequest: jest.fn().mockReturnValue({
			header: (headerName: string) => {
				if (headerName === 'apikey') {
					return mockApiKey;
				} else {
					return undefined;
				}
			},
		}),
	}),
} as unknown as ExecutionContext;

const mockExecutionContextNotSet = {
	switchToHttp: jest.fn().mockReturnValue({
		getRequest: jest.fn().mockReturnValue({
			header: () => {
				return undefined;
			},
		}),
	}),
} as unknown as ExecutionContext;

const mockExecutionContextWrong = {
	switchToHttp: jest.fn().mockReturnValue({
		getRequest: jest.fn().mockReturnValue({
			header: (headerName: string) => {
				if (headerName === 'apikey') {
					return 'wrongApiKey';
				} else {
					return undefined;
				}
			},
		}),
	}),
} as unknown as ExecutionContext;

describe('ApiKeyGuard', () => {
	it('Should allow access when apiKey header is set', async () => {
		const canActivateRoute: boolean = new ApiKeyGuard(
			mockConfigService as unknown as ConfigService
		).canActivate(mockExecutionContextCorrect);
		expect(canActivateRoute).toBe(true);
	});

	it('Should not allow access when apiKey header is not set', async () => {
		let error: any;
		try {
			new ApiKeyGuard(mockConfigService as unknown as ConfigService).canActivate(
				mockExecutionContextNotSet
			);
		} catch (err) {
			error = err;
		}
		expect(error).toBe(API_KEY_EXCEPTION);
	});

	it('Should not allow access when apiKey header is wrong', async () => {
		let error: any;
		try {
			new ApiKeyGuard(mockConfigService as unknown as ConfigService).canActivate(
				mockExecutionContextWrong
			);
		} catch (err) {
			error = err;
		}
		expect(error).toBe(API_KEY_EXCEPTION);
	});
});
