import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { EmailTemplate } from '~modules/campaign-monitor/campaign-monitor.types';
import { Locale } from '~shared/types/types';
import { CreateIeObjectSupportRequestDto } from '../dto/zendesk.dto';

import { ReportLegalReason, ReportReason } from '../zendesk.types';
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
			scope: 'requests:write',
			token_type: 'bearer',
		}),
	});
}

describe('CreateIeObjectSupportRequestDto validation', () => {
	const validPayload = {
		reportReason: ReportReason.GENERAL_QUESTION,
		locale: Locale.Nl,
		message: 'Er klopt iets niet met dit object',
		url: 'https://hetarchief.be/zoeken/maintainer/object-123',
		email: 'reporter@example.com',
		name: 'Test Reporter',
	};

	it('passes validation when all required fields are present', async () => {
		const dto = plainToInstance(CreateIeObjectSupportRequestDto, validPayload);

		const errors = await validate(dto);

		expect(errors).toHaveLength(0);
	});

	it('requires an email address', async () => {
		const dto = plainToInstance(CreateIeObjectSupportRequestDto, {
			...validPayload,
			email: undefined,
		});

		const errors = await validate(dto);

		expect(errors.some((error) => error.property === 'email')).toBe(true);
	});

	it('requires a name', async () => {
		const dto = plainToInstance(CreateIeObjectSupportRequestDto, {
			...validPayload,
			name: undefined,
		});

		const errors = await validate(dto);

		expect(errors.some((error) => error.property === 'name')).toBe(true);
	});

	it('requires a valid reportReason enum value', async () => {
		const dto = plainToInstance(CreateIeObjectSupportRequestDto, {
			...validPayload,
			reportReason: 'NOT_A_REAL_REASON',
		});

		const errors = await validate(dto);

		expect(errors.some((error) => error.property === 'reportReason')).toBe(true);
	});

	it('requires a message', async () => {
		const dto = plainToInstance(CreateIeObjectSupportRequestDto, {
			...validPayload,
			message: undefined,
		});

		const errors = await validate(dto);

		expect(errors.some((error) => error.property === 'message')).toBe(true);
	});

	it('requires a url', async () => {
		const dto = plainToInstance(CreateIeObjectSupportRequestDto, {
			...validPayload,
			url: undefined,
		});

		const errors = await validate(dto);

		expect(errors.some((error) => error.property === 'url')).toBe(true);
	});

	it('requires a valid locale, since anonymous users have no account locale to fall back on', async () => {
		const dto = plainToInstance(CreateIeObjectSupportRequestDto, {
			...validPayload,
			locale: undefined,
		});

		const errors = await validate(dto);

		expect(errors.some((error) => error.property === 'locale')).toBe(true);
	});

	it('rejects an invalid reportLegalReason value when provided', async () => {
		const dto = plainToInstance(CreateIeObjectSupportRequestDto, {
			...validPayload,
			reportReason: ReportReason.LEGAL_REMARK,
			reportLegalReason: 'NOT_A_REAL_LEGAL_REASON',
		});

		const errors = await validate(dto);

		expect(errors.some((error) => error.property === 'reportLegalReason')).toBe(true);
	});

	it('does not require maintainerId, mamUrl, or aiMeemooUrl', async () => {
		const dto = plainToInstance(CreateIeObjectSupportRequestDto, validPayload);

		const errors = await validate(dto);

		expect(errors).toHaveLength(0);
	});
});

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
				scope: 'requests:write',
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

describe('ZendeskService#createIeObjectSupportTicket', () => {
	const mockCampaignMonitorService = { sendTransactionalMail: vi.fn() };
	const mockOrganisationsService = { findOrganisationsBySchemaIdentifiers: vi.fn() };
	const mockConfigService = {
		get: vi.fn((key: string) =>
			key === 'MEEMOO_MAINTAINER_MISSING_EMAIL_FALLBACK' ? 'support@meemoo.be' : undefined
		),
	};
	const mockTranslationsService = {
		tText: vi.fn((key: string, _variables: unknown, locale: Locale) => `${key}::${locale}`),
	};

	function createService(): ZendeskService {
		return new ZendeskService(
			mockCampaignMonitorService as any,
			mockOrganisationsService as any,
			mockConfigService as any,
			mockTranslationsService as any
		);
	}

	const baseDto: CreateIeObjectSupportRequestDto = {
		reportReason: ReportReason.GENERAL_QUESTION,
		locale: Locale.Nl,
		message: 'Er klopt iets niet met dit object',
		url: 'https://hetarchief.be/zoeken/maintainer/object-123',
		email: 'reporter@example.com',
		name: 'Test Reporter',
	} as CreateIeObjectSupportRequestDto;

	beforeEach(() => {
		vi.clearAllMocks();
		(ZendeskService as any).accessToken = null;

		process.env.ZENDESK_ENDPOINT = 'https://meemoo.zendesk.com/api/v2';
		process.env.ZENDESK_TOKEN_ENDPOINT = 'https://meemoo.zendesk.com/oauth/tokens';
		process.env.ZENDESK_CLIENT_ID = 'test-client-id';
		process.env.ZENDESK_CLIENT_SECRET = 'test-client-secret';

		vi.stubGlobal('fetch', mockTokenEndpoint('access-token-1'));
		mockOrganisationsService.findOrganisationsBySchemaIdentifiers.mockResolvedValue([]);
	});

	it('creates a Zendesk ticket for GENERAL_QUESTION and never emails a maintainer', async () => {
		mockCreateClient.mockReturnValue(mockZendeskClient());

		const result = await createService().createIeObjectSupportTicket(baseDto);

		expect(result).toEqual(mockTicketResponse);
		expect(mockCampaignMonitorService.sendTransactionalMail).not.toHaveBeenCalled();
		expect(mockOrganisationsService.findOrganisationsBySchemaIdentifiers).not.toHaveBeenCalled();
	});

	it('maps the reporter name, email, message and url onto the created ticket', async () => {
		const client = mockZendeskClient();
		mockCreateClient.mockReturnValue(client);

		await createService().createIeObjectSupportTicket(baseDto);

		const [{ request }] = (client.requests.create as any).mock.calls[0];
		expect(request.requester).toEqual({ name: baseDto.name, email: baseDto.email });
		expect(request.comment.body).toBe(baseDto.message);
		expect(request.comment.url).toBe(baseDto.url);
		expect(request.comment.public).toBe(false);
	});

	it('builds the ticket subject from the fixed subject key, resolved in the reporter locale', async () => {
		const client = mockZendeskClient();
		mockCreateClient.mockReturnValue(client);

		await createService().createIeObjectSupportTicket(baseDto);

		expect(mockTranslationsService.tText).toHaveBeenCalledWith(
			'modules/visitor-space/components/report-blade/report-blade___media-item-gerapporteerd-door-gebruiker-op-het-archief',
			{},
			baseDto.locale
		);
		const [{ request }] = (client.requests.create as any).mock.calls[0];
		expect(request.subject).toBe(
			`modules/visitor-space/components/report-blade/report-blade___media-item-gerapporteerd-door-gebruiker-op-het-archief::${baseDto.locale}`
		);
	});

	it('creates a Zendesk ticket for LEGAL_REMARK and never emails a maintainer', async () => {
		mockCreateClient.mockReturnValue(mockZendeskClient());

		await createService().createIeObjectSupportTicket({
			...baseDto,
			reportReason: ReportReason.LEGAL_REMARK,
			reportLegalReason: ReportLegalReason.GDPR_PRIVACY,
		});

		expect(mockCampaignMonitorService.sendTransactionalMail).not.toHaveBeenCalled();
	});

	it.each([
		[
			ReportLegalReason.OPT_OUT_OR_REMOVAL,
			'modules/visitor-space/components/report-blade/report-blade___ik-ben-rechthebbende-en-wil-een-opt-out-op-de-out-of-commerce-regeling-aanvragen-voor-dit-materiaal-of-een-verwijdering',
		],
		[
			ReportLegalReason.IP_COMPLAINT,
			'modules/visitor-space/components/report-blade/report-blade___ik-ben-rechthebbende-en-wil-een-klacht-indienen-wegens-mogelijke-inbreuk-op-intellectuele-rechten',
		],
		[
			ReportLegalReason.GDPR_PRIVACY,
			'modules/visitor-space/components/report-blade/report-blade___ik-wil-mijn-rechten-uitoefenen-volgens-de-gdpr-of-privacy-wetgeving-met-betrekking-tot-dit-materiaal-vb-portretrecht',
		],
	])(
		'includes the %s legal reason label in the ticket body for LEGAL_REMARK',
		async (reportLegalReason, expectedKey) => {
			const client = mockZendeskClient();
			mockCreateClient.mockReturnValue(client);

			await createService().createIeObjectSupportTicket({
				...baseDto,
				reportReason: ReportReason.LEGAL_REMARK,
				reportLegalReason,
			});

			const [{ request }] = (client.requests.create as any).mock.calls[0];
			expect(request.comment.html_body).toContain(`${expectedKey}::nl`);
		}
	);

	it('does not leak the string "undefined" into the ticket body when there is no legal reason', async () => {
		const client = mockZendeskClient();
		mockCreateClient.mockReturnValue(client);

		await createService().createIeObjectSupportTicket(baseDto);

		const [{ request }] = (client.requests.create as any).mock.calls[0];
		expect(request.comment.html_body).not.toContain('undefined');
	});

	it('emails the resolved "ontsluiting" contact for METADATA_ISSUE and never creates a ticket', async () => {
		const client = mockZendeskClient();
		mockCreateClient.mockReturnValue(client);
		mockOrganisationsService.findOrganisationsBySchemaIdentifiers.mockResolvedValue([
			{
				contactPoint: [
					{ contactType: 'facturatie', email: 'billing@example.be' },
					{ contactType: 'ontsluiting', email: 'maintainer@example.be' },
				],
			},
		]);

		const result = await createService().createIeObjectSupportTicket({
			...baseDto,
			reportReason: ReportReason.METADATA_ISSUE,
			maintainerId: 'maintainer-id-1',
			mamUrl: 'https://archief-qas.viaa.be/mh/published/abc/details',
			aiMeemooUrl: 'https://ai.meemoo.be/fragment/abc',
		});

		expect(result).toBeUndefined();
		expect(mockOrganisationsService.findOrganisationsBySchemaIdentifiers).toHaveBeenCalledWith([
			'maintainer-id-1',
		]);
		expect(client.requests.create).not.toHaveBeenCalled();
		expect(mockCampaignMonitorService.sendTransactionalMail).toHaveBeenCalledTimes(1);

		const [mailInfo, lang] = mockCampaignMonitorService.sendTransactionalMail.mock.calls[0];
		expect(mailInfo.template).toBe(
			EmailTemplate.CAMPAIGN_MONITOR_TEMPLATE_REPORT_METADATA_ISSUE_IE_OBJECT
		);
		expect(mailInfo.data.to).toBe('maintainer@example.be');
		expect(mailInfo.data.replyTo).toBe(baseDto.email);
		expect(mailInfo.data.data.mam_url).toBe('https://archief-qas.viaa.be/mh/published/abc/details');
		expect(mailInfo.data.data.ai_meemoo_url).toBe('https://ai.meemoo.be/fragment/abc');
		expect(mailInfo.data.data.reporter_name).toBe(baseDto.name);
		expect(mailInfo.data.data.reporter_email).toBe(baseDto.email);
		expect(mailInfo.data.data.message).toBe(baseDto.message);
		expect(lang).toBe(Locale.Nl);
	});

	it('falls back to the meemoo support address and never creates a ticket when no "ontsluiting" contact can be resolved', async () => {
		const client = mockZendeskClient();
		mockCreateClient.mockReturnValue(client);
		mockOrganisationsService.findOrganisationsBySchemaIdentifiers.mockResolvedValue([
			{ contactPoint: [{ contactType: 'facturatie', email: 'billing@example.be' }] },
		]);

		const result = await createService().createIeObjectSupportTicket({
			...baseDto,
			reportReason: ReportReason.METADATA_ISSUE,
			maintainerId: 'maintainer-id-1',
		});

		expect(result).toBeUndefined();
		expect(client.requests.create).not.toHaveBeenCalled();
		expect(mockCampaignMonitorService.sendTransactionalMail).toHaveBeenCalledTimes(1);
		const [mailInfo] = mockCampaignMonitorService.sendTransactionalMail.mock.calls[0];
		expect(mailInfo.data.to).toBe('support@meemoo.be');
	});

	it('falls back to the meemoo support address when METADATA_ISSUE has no maintainerId at all', async () => {
		const client = mockZendeskClient();
		mockCreateClient.mockReturnValue(client);

		const result = await createService().createIeObjectSupportTicket({
			...baseDto,
			reportReason: ReportReason.METADATA_ISSUE,
		});

		expect(result).toBeUndefined();
		expect(mockOrganisationsService.findOrganisationsBySchemaIdentifiers).not.toHaveBeenCalled();
		expect(client.requests.create).not.toHaveBeenCalled();
		const [mailInfo] = mockCampaignMonitorService.sendTransactionalMail.mock.calls[0];
		expect(mailInfo.data.to).toBe('support@meemoo.be');
	});

	it('uses the requested locale to build both the ticket subject and body in NL and EN', async () => {
		const nlClient = mockZendeskClient();
		mockCreateClient.mockReturnValueOnce(nlClient);
		await createService().createIeObjectSupportTicket({ ...baseDto, locale: Locale.Nl });
		const [{ request: nlRequest }] = (nlClient.requests.create as any).mock.calls[0];

		(ZendeskService as any).accessToken = null;
		vi.stubGlobal('fetch', mockTokenEndpoint('access-token-2'));
		const enClient = mockZendeskClient();
		mockCreateClient.mockReturnValueOnce(enClient);
		await createService().createIeObjectSupportTicket({ ...baseDto, locale: Locale.En });
		const [{ request: enRequest }] = (enClient.requests.create as any).mock.calls[0];

		expect(nlRequest.subject).not.toEqual(enRequest.subject);
		expect(nlRequest.comment.html_body).not.toEqual(enRequest.comment.html_body);
	});

	it('propagates the error when the Zendesk API fails to create the ticket', async () => {
		mockCreateClient.mockReturnValue(mockZendeskClient([500, 500]));

		await expect(createService().createIeObjectSupportTicket(baseDto)).rejects.toBeTruthy();
	});

	it('propagates the error when sending the maintainer notification email fails', async () => {
		mockOrganisationsService.findOrganisationsBySchemaIdentifiers.mockResolvedValue([
			{ contactPoint: [{ contactType: 'ontsluiting', email: 'maintainer@example.be' }] },
		]);
		mockCampaignMonitorService.sendTransactionalMail.mockRejectedValue(
			new Error('Campaign Monitor is down')
		);

		await expect(
			createService().createIeObjectSupportTicket({
				...baseDto,
				reportReason: ReportReason.METADATA_ISSUE,
				maintainerId: 'maintainer-id-1',
			})
		).rejects.toThrow('Campaign Monitor is down');
	});
});
