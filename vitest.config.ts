import path from 'node:path';
import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [swc.vite()],
	cacheDir: path.resolve(__dirname, 'node_modules/.vite'),
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
		pool: 'threads',
		maxWorkers: 8,
	},
});
