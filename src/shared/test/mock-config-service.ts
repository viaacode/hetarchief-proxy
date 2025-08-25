import type { Configuration } from '~config';

export const MOCK_MEEMOO_ADMIN_ORGANIZATION_IDS = 'OR-1,OR-2';
export const MOCK_API_KEY = 'MySecretApiKey';
export const MOCK_SSUM_REGISTRATION_PAGE = 'http://meemoo.be/dummy-ssum-registration-page';

export const mockConfigService = {
	get: jest.fn((key: keyof Configuration): string | boolean => {
		switch (key) {
			case 'NODE_ENV':
				return 'test';
			case 'MEEMOO_ADMIN_ORGANIZATION_IDS':
				return MOCK_MEEMOO_ADMIN_ORGANIZATION_IDS;
			case 'PROXY_API_KEY':
				return MOCK_API_KEY;
			case 'SSUM_REGISTRATION_PAGE':
				return MOCK_SSUM_REGISTRATION_PAGE;
			case 'CLIENT_HOST':
				return 'https://hetarchief.test'; // should be a syntactically valid url
			case 'HOST':
				return 'http://api.hetarchief.test';
			case 'CAMPAIGN_MONITOR_API_ENDPOINT':
				return 'http://campaignmonitor';
			case 'CAMPAIGN_MONITOR_TRANSACTIONAL_SEND_MAIL_API_ENDPOINT':
				return 'transactional/smartemail';
			case 'CAMPAIGN_MONITOR_SUBSCRIBER_API_ENDPOINT':
				return 'subscribers';
			case 'CAMPAIGN_MONITOR_OPTIN_LIST_HETARCHIEF':
				return 'fakeListId';
			case 'REROUTE_EMAILS_TO':
				return '';
			case 'ENABLE_SEND_EMAIL':
				return true;
			case 'ELASTICSEARCH_URL':
				return 'http://elasticsearch'; // should be a syntactically valid url
			case 'TICKET_SERVICE_URL':
				return 'http://ticketservice';
			case 'MEDIA_SERVICE_URL':
				return 'http://mediaservice';
			case 'ENVIRONMENT':
				return 'production';
			case 'COOKIE_SECRET':
				return 'thecookiesecret';
			case 'COOKIE_MAX_AGE':
				return '86400';
			case 'REDIS_CONNECTION_STRING':
				return 'redis connection string';
			default:
				if (key.startsWith('CAMPAIGN_MONITOR_TEMPLATE_')) {
					return 'fakeTemplateId';
				}
				return key;
		}
	}),
};
