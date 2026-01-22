import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { decryptData, encryptData } from './crypto-helper';

describe('crypto-helper', () => {
	const env = process.env;
	beforeEach(async () => {
		process.env.CAMPAIN_MONITOR_CONFIRM_EMAIL_TOKEN_SECRET_KEY = 'fakeSecretKey';
		process.env.CAMPAIN_MONITOR_CONFIRM_EMAIL_TOKEN_SECRET_IV = 'fakeSecretIV';
		process.env.CAMPAIN_MONITOR_CONFIRM_EMAIL_TOKEN_ECNRYPTION_METHOD = 'aes-256-cbc';
	});

	afterEach(() => {
		process.env = env;
	});

	describe('encryptData', () => {
		it('should succesfully encrypt a string', () => {
			const result = encryptData('test');
			expect(result).toEqual('Y2U5YjA2M2NhZmNiNjdkNWY0NGE5NTU1ZjlmNmQxOTg=');
		});
		it('should fail when data is empty', () => {
			try {
				encryptData(null);
			} catch (err) {
				expect(err.name).toBe('TypeError');
			}
		});
	});

	describe('decryptData', () => {
		it('should succesfully encrypt a string', () => {
			const result = decryptData('Y2U5YjA2M2NhZmNiNjdkNWY0NGE5NTU1ZjlmNmQxOTg=');
			expect(result).toEqual('test');
		});
		it('should fail when data is empty', () => {
			try {
				decryptData(null);
			} catch (err) {
				expect(err.name).toBe('TypeError');
			}
		});
	});
});
