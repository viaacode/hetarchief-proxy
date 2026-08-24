import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ZendeskService } from './zendesk.service';

const mockCreateClient = vi.hoisted(() => vi.fn());

vi.mock('node-zendesk', () => ({
	default: { createClient: mockCreateClient },
}));

const mockTicketRequest = {
	subject: 'Test ticket',
	comment: { body: 'Test comment' },
};

const mockTicketResponse = { id: 1, subject: 'Test ticket' };

/**
 * A node-zendesk client whose requests.create() fails with the given status codes before succeeding
 */
function mockZendeskClient(failWithStatusCodes: number[] = []) {
	const statusCodes = [...failWithStatusCodes];
	return {
		requests: {
			create: vi.fn((_body, callback) => {
				const statusCode = statusCodes.shift();
				if (statusCode) {
					const error: Error & { statusCode?: number } = new Error(`Zendesk Error (${statusCode})`);
					error.statusCode = statusCode;
					callback(error, null, null);
					return;
				}
				callback(undefined, null, mockTicketResponse);
			}),
		},
	};
}

function mockTokenEndpoint(accessToken: string) {
	return vi.fn().mockResolvedValue({
		status: 201,
		statusText: 'Created',
		json: async () => ({
			access_token: accessToken,
			expires_in: 1800,
			scope: 'tickets:write',
			token_type: 'bearer',
		}),
	});
}

describe('ZendeskService', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		// Reset the cached access token between tests
		(ZendeskService as any).accessToken = null;

		process.env.ZENDESK_ENDPOINT = 'https://meemoo.zendesk.com/api/v2';
		process.env.ZENDESK_TOKEN_ENDPOINT = 'https://meemoo.zendesk.com/oauth/tokens';
		process.env.ZENDESK_CLIENT_ID = 'test-client-id';
		process.env.ZENDESK_CLIENT_SECRET = 'test-client-secret';
	});

	it('requests an oauth access token with the client credentials grant', async () => {
		const fetchMock = mockTokenEndpoint('access-token-1');
		vi.stubGlobal('fetch', fetchMock);
		mockCreateClient.mockReturnValue(mockZendeskClient());

		await ZendeskService.createTicket(mockTicketRequest as any);

		expect(fetchMock).toHaveBeenCalledWith('https://meemoo.zendesk.com/oauth/tokens', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
			body: JSON.stringify({
				grant_type: 'client_credentials',
				client_id: 'test-client-id',
				client_secret: 'test-client-secret',
				scope: 'tickets:write',
			}),
		});
		expect(mockCreateClient).toHaveBeenCalledWith(
			expect.objectContaining({ oauth: true, token: 'access-token-1' })
		);
	});

	it('reuses the cached access token while it is still valid', async () => {
		const fetchMock = mockTokenEndpoint('access-token-1');
		vi.stubGlobal('fetch', fetchMock);
		mockCreateClient.mockReturnValue(mockZendeskClient());

		await ZendeskService.createTicket(mockTicketRequest as any);
		await ZendeskService.createTicket(mockTicketRequest as any);

		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(mockCreateClient).toHaveBeenCalledTimes(2);
	});

	it('fetches a new access token and retries once when zendesk returns a 401', async () => {
		const fetchMock = vi
			.fn()
			.mockResolvedValueOnce({
				status: 201,
				json: async () => ({ access_token: 'revoked-token', expires_in: 1800 }),
			})
			.mockResolvedValueOnce({
				status: 201,
				json: async () => ({ access_token: 'fresh-token', expires_in: 1800 }),
			});
		vi.stubGlobal('fetch', fetchMock);
		mockCreateClient
			.mockReturnValueOnce(mockZendeskClient([401]))
			.mockReturnValueOnce(mockZendeskClient());

		const result = await ZendeskService.createTicket(mockTicketRequest as any);

		expect(result).toEqual(mockTicketResponse);
		expect(fetchMock).toHaveBeenCalledTimes(2);
		expect(mockCreateClient).toHaveBeenNthCalledWith(
			2,
			expect.objectContaining({ token: 'fresh-token' })
		);
	});

	it('throws when the token endpoint fails', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue({
				status: 401,
				statusText: 'Unauthorized',
				text: async () => 'invalid_client',
			})
		);

		await expect(ZendeskService.createTicket(mockTicketRequest as any)).rejects.toThrow();
	});

	it('does not retry more than once on a 401 from the zendesk api', async () => {
		vi.stubGlobal('fetch', mockTokenEndpoint('access-token-1'));
		mockCreateClient.mockReturnValue(mockZendeskClient([401, 401]));

		await expect(ZendeskService.createTicket(mockTicketRequest as any)).rejects.toMatchObject({
			statusCode: 401,
		});
		expect(mockCreateClient).toHaveBeenCalledTimes(2);
	});
});
