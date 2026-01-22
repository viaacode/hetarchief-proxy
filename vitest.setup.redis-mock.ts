import { vi } from 'vitest';

vi.mock('redis', async () => {
	const redisMock = await vi.importActual('redis-mock');
	return redisMock;
});
