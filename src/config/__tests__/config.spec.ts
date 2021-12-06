// import config, { DEFAULT_CONFIG } from '~config';

import config, { DEFAULT_CONFIG } from '~config';

describe('Configuration', () => {
	// Keep backup of original env vars to make sure our test cases are isolated
	// and no side effects are created with other cases
	const originalEnv = process.env;

	beforeEach(() => {
		jest.resetModules();
	});

	afterEach(() => {
		// Restore original env vars
		process.env = originalEnv;
	});

	it('Should return the configuration based on the environment', () => {
		const customPort = 3200;
		process.env = {
			...originalEnv,
			PORT: customPort.toString(),
		};
		const testConfig = config();
		expect(testConfig.port).toBe(customPort);
	});

	it('Should return a default configuration if no environment is set', () => {
		const testConfig = config();
		expect(testConfig.port).toBe(DEFAULT_CONFIG.port);
	});
});
