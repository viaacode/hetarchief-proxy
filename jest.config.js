module.exports = {
	moduleFileExtensions: ['js', 'json', 'ts'],
	moduleNameMapper: {
		'^~config/?(.*)$': ['<rootDir>/config/$1'],
		'^~modules/?(.*)$': ['<rootDir>/modules/$1'],
		'^~shared/?(.*)$': ['<rootDir>/shared/$1'],
	},
	rootDir: 'src',
	testEnvironment: 'node',
	testRegex: '.*\\.spec\\.ts$',
	transform: {
		'^.+\\.(t|j)s$': 'ts-jest',
	},
	collectCoverageFrom: ['**/*.(t|j)s'],
	coverageDirectory: '../coverage',
	coverageThreshold: {
		global: {
			branches: 80,
			functions: 80,
			lines: 80,
			statements: 80,
		},
	},
	setupFilesAfterEnv: ['../jest.setup.redis-mock.ts'],
};
