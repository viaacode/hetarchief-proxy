import path from 'node:path';
import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [swc.vite()],
	resolve: {
		alias: {
			'~config': path.resolve(__dirname, 'src/config'),
			'~modules': path.resolve(__dirname, 'src/modules'),
			'~generated': path.resolve(__dirname, 'src/generated'),
			'~shared': path.resolve(__dirname, 'src/shared'),
		},
	},
	test: {
		root: 'src',
		globals: true,
		environment: 'node',
		include: ['**/*.spec.ts'],
		setupFiles: ['../test/vitest.setup.ts', '../vitest.setup.redis-mock.ts'],
		coverage: {
			provider: 'v8',
			reportsDirectory: '../coverage',
			include: ['**/*.(t|j)s'],
			exclude: ['node_modules', '**/*.module.ts', '**/*.dto.ts', '**/index.ts'],
			thresholds: {
				branches: 80,
				functions: 80,
				lines: 80,
				statements: 80,
			},
		},
		pool: 'threads',
		maxWorkers: 8,
	},
});
