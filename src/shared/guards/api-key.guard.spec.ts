import { vi } from 'vitest';
import type { ExecutionContext } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import type { Configuration } from '~config';

import { APIKEY, API_KEY_EXCEPTION, ApiKeyGuard } from '~shared/guards/api-key.guard';

const mockApiKey = 'MySecretApiKey';

const mockConfigService: ConfigService<Configuration> = {
	get: vi.fn((key: keyof Configuration): string | boolean => {
		if (key === 'PROXY_API_KEY') {
			return mockApiKey;
		}
		return key;
	}),
} as unknown as ConfigService<Configuration>;

const mockExecutionContextCorrect = {
	switchToHttp: vi.fn().mockReturnValue({
		getRequest: vi.fn().mockReturnValue({
			header: (headerName: string) => {
				if (headerName === APIKEY) {
					return mockApiKey;
				}
				return undefined;
			},
		}),
	}),
} as unknown as ExecutionContext;

const mockExecutionContextNotSet = {
	switchToHttp: vi.fn().mockReturnValue({
		getRequest: vi.fn().mockReturnValue({
			header: () => {
				return undefined;
			},
		}),
	}),
} as unknown as ExecutionContext;

const mockExecutionContextWrong = {
	switchToHttp: vi.fn().mockReturnValue({
		getRequest: vi.fn().mockReturnValue({
			header: (headerName: string) => {
				if (headerName === APIKEY) {
					return 'wrongApiKey';
				}
				return undefined;
			},
		}),
	}),
} as unknown as ExecutionContext;

describe('ApiKeyGuard', () => {
	it('Should allow access when apiKey header is set', async () => {
		const canActivateRoute: boolean = new ApiKeyGuard(
			mockConfigService as unknown as ConfigService<Configuration>
		).canActivate(mockExecutionContextCorrect);
		expect(canActivateRoute).toBe(true);
	});

	it('Should not allow access when apiKey header is not set', async () => {
		let error: any;
		try {
			new ApiKeyGuard(mockConfigService as unknown as ConfigService<Configuration>).canActivate(
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
			new ApiKeyGuard(mockConfigService as unknown as ConfigService<Configuration>).canActivate(
				mockExecutionContextWrong
			);
		} catch (err) {
			error = err;
		}
		expect(error).toBe(API_KEY_EXCEPTION);
	});
});
