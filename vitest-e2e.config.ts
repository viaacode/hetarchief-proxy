import path from 'node:path';
import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [swc.vite()],
	resolve: {
		alias: {
			'~config': path.resolve(__dirname, 'src/config'),
			'~modules': path.resolve(__dirname, 'src/modules'),
			'~shared': path.resolve(__dirname, 'src/shared'),
		},
	},
	test: {
		root: 'test',
		globals: true,
		environment: 'node',
		include: ['**/*.e2e-spec.ts'],
	},
});
