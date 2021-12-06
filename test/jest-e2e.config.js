module.exports = {
	moduleFileExtensions: ['js', 'json', 'ts'],
	moduleNameMapper: {
		'^~config\/?(.*)$': ['../src/config/$1'],
		'^~modules\/?(.*)$': ['../src/modules/$1'],
		'^~shared\/?(.*)$': ['../src/shared/$1'],
	},
	rootDir: '.',
	testEnvironment: 'node',
	testRegex: '.e2e-spec.ts$',
	transform: {
		'^.+\\.(t|j)s$': 'ts-jest',
	},
};
