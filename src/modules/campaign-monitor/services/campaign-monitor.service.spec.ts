import { TranslationsService } from '@meemoo/admin-core-api';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, type TestingModule } from '@nestjs/testing';

import { EmailTemplate } from '../campaign-monitor.types';
import {
	mockCampaignMonitorMaterialRequestDataToMaintainer,
	mockCampaignMonitorMaterialRequestDataToRequester,
	mockConfirmationData,
	mockMaterialRequestEmailInfo,
	mockNewsletterTemplateDataWithNewsletter,
	mockNewsletterUpdatePreferencesQueryDto,
	mockSendMailQueryDto,
	mockUser,
	mockUserInfo,
} from '../mocks/campaign-monitor.mocks';

import { CampaignMonitorService } from './campaign-monitor.service';

import { Lookup_Maintainer_Visitor_Space_Request_Access_Type_Enum } from '~generated/graphql-db-types-hetarchief';
import { type VisitRequest, VisitStatus } from '~modules/visits/types';
import { mockTranslationsService } from '~shared/helpers/mockTranslationsService';
import { TestingLogger } from '~shared/logging/test-logger';
import { mockConfigService } from '~shared/test/mock-config-service';
import { Locale } from '~shared/types/types';

const getMockVisitRequest = (): VisitRequest => ({
	id: '1',
	spaceId: 'space-1',
	spaceSlug: 'vrt',
	spaceMaintainerId: 'or-rf5kf25',
	spaceName: 'VRT',
	spaceMail: 'cp-VRT@studiohyperdrive.be',
	spaceTelephone: '0412 34 56 78',
	userProfileId: 'user-1',
	timeframe: 'july 2022',
	reason: 'fake news investigation',
	startAt: '2022-07-01T10:00:00',
	endAt: '2022-07-31T18:00:00',
	status: VisitStatus.APPROVED,
	note: {
		id: '7c672f64-287e-4598-befb-0cd0190124f7',
		note: 'Visit is limited to max. 2h',
		authorName: 'Ad Ministrator',
		createdAt: '2022-03-01T16:00:00',
	},
	createdAt: '2022-02-01T10:00:00',
	updatedAt: '2022-02-01T10:00:00',
	visitorId: 'user-1',
	visitorMail: 'test@studiohyperdrive.be',
	visitorFirstName: 'Tom',
	visitorLastName: 'Testerom',
	visitorName: 'Tom Testerom',
	visitorLanguage: Locale.Nl,
	updatedById: 'ea3d92ab-0281-4ffe-9e2d-be0e687e7cd1',
	updatedByName: 'CP Admin',
	accessType: Lookup_Maintainer_Visitor_Space_Request_Access_Type_Enum.Full,
});

describe('CampaignMonitorService', () => {
	let campaignMonitorService: CampaignMonitorService;
	const env = process.env;

	beforeEach(async () => {
		process.env.CAMPAIGN_MONITOR_TEMPLATE_MATERIAL_REQUEST_REQUESTER = 'fakeTemplateId';
		process.env.CAMPAIGN_MONITOR_TEMPLATE_MATERIAL_REQUEST_MAINTAINER = 'fakeTemplateId';
		process.env.CAMPAIGN_MONITOR_TEMPLATE_VISIT_APPROVED = 'fakeTemplateId';
		process.env.CAMPAIGN_MONITOR_TEMPLATE_VISIT_DENIED = null;
		process.env.CAMPAIN_MONITOR_CONFIRM_EMAIL_TOKEN_SECRET_KEY = 'fakeSecretKey';
		process.env.CAMPAIN_MONITOR_CONFIRM_EMAIL_TOKEN_SECRET_IV = 'fakeSecretIV';
		process.env.CAMPAIN_MONITOR_CONFIRM_EMAIL_TOKEN_ECNRYPTION_METHOD = 'aes-256-cbc';
		process.env.CAMPAIGN_MONITOR_TEMPLATE_MATERIAL_REQUEST_REQUESTER__NL = 'fakeTemplateId';

		const module: TestingModule = await Test.createTestingModule({
			imports: [ConfigModule],
			providers: [
				CampaignMonitorService,
				{
					provide: ConfigService,
					useValue: mockConfigService,
				},
				{
					provide: TranslationsService,
					useValue: mockTranslationsService,
				},
			],
		})
			.setLogger(new TestingLogger())
			.compile();

		campaignMonitorService = module.get<CampaignMonitorService>(CampaignMonitorService);
	});

	afterEach(() => {
		process.env = env;
	});

	it('services should be defined', () => {
		expect(campaignMonitorService).toBeDefined();
	});

	describe('getAdminEmail', () => {
		it('should return the rerout email address if set', () => {
			campaignMonitorService.setRerouteEmailsTo('overrule@meemoo.be');
			expect(campaignMonitorService.getAdminEmail('me@meemoo.be')).toEqual('overrule@meemoo.be');
		});

		it('should return the rerout email address if set', () => {
			campaignMonitorService.setRerouteEmailsTo(undefined);
			expect(campaignMonitorService.getAdminEmail('me@meemoo.be')).toEqual('me@meemoo.be');
		});
	});

	describe('convertVisitToEmailTemplateData', () => {
		it('should parse visits with empty startAt / endAt', () => {
			const visit = getMockVisitRequest();
			visit.startAt = null;
			visit.endAt = null;
			const result = campaignMonitorService.convertVisitToEmailTemplateData(visit);
			expect(result.start_date).toEqual('');
			expect(result.start_time).toEqual('');
			expect(result.end_date).toEqual('');
			expect(result.end_time).toEqual('');
		});
	});

	describe('sendForVisit', () => {
		it('should use fallback email if email address is undefined for a maintainer', async () => {
			const visit = getMockVisitRequest();
			const sendTransactionalMailSpy = jest.spyOn(campaignMonitorService, 'sendTransactionalMail');
			sendTransactionalMailSpy.mockResolvedValueOnce(undefined);

			await campaignMonitorService.sendForVisit({
				to: [{ id: visit.visitorId, email: null, language: Locale.Nl }],
				template: EmailTemplate.VISIT_APPROVED,
				visitRequest: visit,
			});
			expect(sendTransactionalMailSpy).toBeCalledWith(
				{
					template: EmailTemplate.VISIT_APPROVED,
					data: {
						to: ['MEEMOO_MAINTAINER_MISSING_EMAIL_FALLBACK'],
						consentToTrack: 'unchanged',
						data: {
							client_firstname: 'Tom',
							client_lastname: 'Testerom',
							client_email: 'test@studiohyperdrive.be',
							contentpartner_name: 'VRT',
							contentpartner_email: 'cp-VRT@studiohyperdrive.be',
							request_reason: 'fake news investigation',
							request_time: 'july 2022',
							request_url: `${mockConfigService.get('CLIENT_HOST')}/beheer/aanvragen`,
							request_remark: 'Visit is limited to max. 2h',
							start_date: '1 juli 2022',
							start_time: '12:00',
							end_date: '31 juli 2022',
							end_time: '20:00',
						},
					},
				},
				'nl'
			);
		});
		// ARC-1537 Re-enable this test ones the FE has switched to using enum templates name
		// it('should NOT call the campaign monitor if the template was not found', async () => {
		// 	const visit = getMockVisit();
		// 	try {
		// 		await campaignMonitorService.sendForVisit({
		// 			template: 'visitDenied' as Template,
		// 			visit,
		// 			to: [{ id: visit.visitorId, email: visit.visitorMail }],
		// 		});
		// 		fail(
		// 			new Error(
		// 				'sendForVisit should throw an error when an invalid template is passed'
		// 			)
		// 		);
		// 	} catch (err) {
		// 		expect(err.message).toEqual('Internal Server Error Exception');
		// 	}
		// });

		it('should NOT call the campaign monitor api if email sending is disabled', async () => {
			campaignMonitorService.setIsEnabled(false);
			const visitRequest = getMockVisitRequest();
			try {
				await campaignMonitorService.sendForVisit({
					template: EmailTemplate.VISIT_APPROVED,
					visitRequest: visitRequest,
					to: [
						{
							id: visitRequest.visitorId,
							email: visitRequest.visitorMail,
							language: visitRequest.visitorLanguage,
						},
					],
				});
			} catch (err) {
				expect(err.name).toEqual('BadRequestException');
			}
			campaignMonitorService.setIsEnabled(true);
		});

		it('should early return when no recipients are provided', async () => {
			const response = await campaignMonitorService.sendForVisit({
				template: EmailTemplate.VISIT_APPROVED,
				visitRequest: getMockVisitRequest(),
				to: [],
			});

			expect(response).toBeUndefined();
		});
	});

	describe('convertMaterialRequestsToEmailTemplateData', () => {
		it('should parse materialRequestEmailInfo with Maintainer Template', () => {
			const result = campaignMonitorService.convertMaterialRequestsToEmailTemplateData(
				mockMaterialRequestEmailInfo
			);
			expect(result).toEqual(mockCampaignMonitorMaterialRequestDataToMaintainer);
		});

		it('should parse materialRequestEmailInfo with Requester Template', () => {
			const materialRequestEmailInfo = mockMaterialRequestEmailInfo;
			materialRequestEmailInfo.template = EmailTemplate.MATERIAL_REQUEST_REQUESTER;
			const result =
				campaignMonitorService.convertMaterialRequestsToEmailTemplateData(materialRequestEmailInfo);
			expect(result).toEqual(mockCampaignMonitorMaterialRequestDataToRequester);
		});
	});

	describe('sendForMaterialRequest', () => {
		it('should throw an error and not send to an empty recipients email address', async () => {
			const materialRequestEmailInfo = mockMaterialRequestEmailInfo;
			materialRequestEmailInfo.template = EmailTemplate.MATERIAL_REQUEST_REQUESTER;
			materialRequestEmailInfo.to = null;
			const sendTransactionalMailSpy = jest.spyOn(campaignMonitorService, 'sendTransactionalMail');
			sendTransactionalMailSpy.mockResolvedValueOnce(undefined);
			try {
				await campaignMonitorService.sendForMaterialRequest(materialRequestEmailInfo);
			} catch (err) {
				expect(err.name).toEqual('BadRequestException');
			}
			materialRequestEmailInfo.to = 'test@example.com';
		});
		// ARC-1537 Re-enable this test ones the FE has switched to using enum templates name
		// it('should log and throw error with invalid template, returns false', async () => {
		// 	const materialRequestEmailInfo = mockMaterialRequestEmailInfo;
		// 	materialRequestEmailInfo.template = 'visitDenied' as Template;
		// 	try {
		// 		await campaignMonitorService.sendForMaterialRequest(materialRequestEmailInfo);
		// 		fail(
		// 			new Error(
		// 				'sendForMaterialRequest should throw an error when an invalid template is passed'
		// 			)
		// 		);
		// 	} catch (err) {
		// 		expect(err.message).toEqual('Internal Server Error Exception');
		// 	}
		// });

		it('should NOT call the campaign monitor api if email sending is disabled', async () => {
			campaignMonitorService.setIsEnabled(false);
			const materialRequestEmailInfo = mockMaterialRequestEmailInfo;
			materialRequestEmailInfo.template = EmailTemplate.MATERIAL_REQUEST_REQUESTER;

			const result = await campaignMonitorService.sendForMaterialRequest(materialRequestEmailInfo);
			expect(result).toBeFalsy();
			campaignMonitorService.setIsEnabled(true);
		});

		it('should successfully send mail when emailInfo has valid fields', async () => {
			campaignMonitorService.makeCmApiRequest = jest.fn().mockResolvedValueOnce({
				Status: 'Accepted',
				MessageID: '91206192-c71c-11ed-8c12-c59c777888d7',
				Recipient: 'test@example.com',
			});

			try {
				const materialRequestEmailInfo = mockMaterialRequestEmailInfo;
				materialRequestEmailInfo.template = EmailTemplate.MATERIAL_REQUEST_REQUESTER;
				materialRequestEmailInfo.to = 'test@example.com';
				await campaignMonitorService.sendForMaterialRequest(materialRequestEmailInfo);
			} catch (err) {
				expect(err).toBeUndefined();
			}
		});

		it('should throw an error when CM throws an error', async () => {
			campaignMonitorService.makeCmApiRequest = jest.fn().mockRejectedValueOnce('');
			try {
				const materialRequestEmailInfo = mockMaterialRequestEmailInfo;
				materialRequestEmailInfo.template = EmailTemplate.MATERIAL_REQUEST_REQUESTER;
				materialRequestEmailInfo.to = 'test@example.com';
				await campaignMonitorService.sendForMaterialRequest(materialRequestEmailInfo);
				fail(
					new Error('sendForMaterialRequest should have thrown an error when CM throws an error')
				);
			} catch (e) {
				expect(e).toBeDefined();
			}
		});
	});

	describe('convertPreferencesToNewsletterTemplateData', () => {
		it('should parse preferences to newsletterTemplateData', () => {
			const result = campaignMonitorService.convertPreferencesToNewsletterTemplateData(
				mockUserInfo,
				true
			);
			expect(result.EmailAddress).toEqual(mockNewsletterTemplateDataWithNewsletter.EmailAddress);
			expect(result.Name).toEqual(mockNewsletterTemplateDataWithNewsletter.Name);
			expect(result.Resubscribe).toEqual(mockNewsletterTemplateDataWithNewsletter.Resubscribe);
			expect(result.ConsentToTrack).toEqual(
				mockNewsletterTemplateDataWithNewsletter.ConsentToTrack
			);
			expect(result.CustomFields[0]).toEqual(
				mockNewsletterTemplateDataWithNewsletter.CustomFields[0]
			);
			expect(result.CustomFields[1]).toEqual(
				mockNewsletterTemplateDataWithNewsletter.CustomFields[1]
			);
			expect(result.CustomFields[2]).toEqual(
				mockNewsletterTemplateDataWithNewsletter.CustomFields[2]
			);
			expect(result.CustomFields[3]).toEqual(
				mockNewsletterTemplateDataWithNewsletter.CustomFields[3]
			);
			expect(result.CustomFields[4]).toEqual(
				mockNewsletterTemplateDataWithNewsletter.CustomFields[4]
			);
			expect(result.CustomFields[5]).toEqual(
				mockNewsletterTemplateDataWithNewsletter.CustomFields[5]
			);
			expect(result.CustomFields[6]).toEqual(
				mockNewsletterTemplateDataWithNewsletter.CustomFields[6]
			);
			expect(result.CustomFields[7]).toEqual(
				mockNewsletterTemplateDataWithNewsletter.CustomFields[7]
			);
			expect(result.CustomFields[8]).toBeUndefined();
		});

		it('should parse preferences to newsletterTemplateData', () => {
			const result = campaignMonitorService.convertPreferencesToNewsletterTemplateData(
				mockUserInfo,
				true
			);
			expect(result.EmailAddress).toEqual(mockNewsletterTemplateDataWithNewsletter.EmailAddress);
			expect(result.Name).toEqual(mockNewsletterTemplateDataWithNewsletter.Name);
			expect(result.Resubscribe).toEqual(mockNewsletterTemplateDataWithNewsletter.Resubscribe);
			expect(result.ConsentToTrack).toEqual(
				mockNewsletterTemplateDataWithNewsletter.ConsentToTrack
			);
			expect(result.CustomFields[0]).toEqual(
				mockNewsletterTemplateDataWithNewsletter.CustomFields.find(
					(field) => field.Key === result.CustomFields[0].Key
				)
			);
			expect(result.CustomFields[1]).toEqual(
				mockNewsletterTemplateDataWithNewsletter.CustomFields.find(
					(field) => field.Key === result.CustomFields[1].Key
				)
			);
			expect(result.CustomFields[2]).toEqual(
				mockNewsletterTemplateDataWithNewsletter.CustomFields.find(
					(field) => field.Key === result.CustomFields[2].Key
				)
			);
			expect(result.CustomFields[3]).toEqual(
				mockNewsletterTemplateDataWithNewsletter.CustomFields.find(
					(field) => field.Key === result.CustomFields[3].Key
				)
			);
			expect(result.CustomFields[4]).toEqual(
				mockNewsletterTemplateDataWithNewsletter.CustomFields.find(
					(field) => field.Key === result.CustomFields[4].Key
				)
			);
			expect(result.CustomFields[5]).toEqual(
				mockNewsletterTemplateDataWithNewsletter.CustomFields.find(
					(field) => field.Key === result.CustomFields[5].Key
				)
			);
			expect(result.CustomFields[6]).toEqual(
				mockNewsletterTemplateDataWithNewsletter.CustomFields.find(
					(field) => field.Key === result.CustomFields[6].Key
				)
			);
			expect(result.CustomFields[7]).toEqual(
				mockNewsletterTemplateDataWithNewsletter.CustomFields.find(
					(field) => field.Key === result.CustomFields[7].Key
				)
			);
			expect(result.CustomFields[8]).toBeUndefined();
		});
	});

	describe('fetchNewsletterPreferences', () => {
		it('should return newsletter = true when user is subscribed to "newsletter"', async () => {
			campaignMonitorService.makeCmApiRequest = jest.fn().mockResolvedValueOnce({
				State: 'Active',
			});
			const result = await campaignMonitorService.fetchNewsletterPreferences(mockUser.email);
			expect(result).toEqual({ newsletter: true });
		});

		it('should return newsletter = false when user is not subscribed to newsletter', async () => {
			campaignMonitorService.makeCmApiRequest = jest.fn().mockResolvedValueOnce({
				State: 'Inactive',
			});
			const result = await campaignMonitorService.fetchNewsletterPreferences(mockUser.email);
			expect(result).toEqual({ newsletter: false });
		});

		it('should throw error when CM throws error other than 203', async () => {
			campaignMonitorService.makeCmApiRequest = jest.fn().mockRejectedValueOnce('');
			try {
				await campaignMonitorService.fetchNewsletterPreferences(mockUser.email);
				fail(
					new Error(
						'fetchNewsletterPreferences should have thrown an error when CM throws an error'
					)
				);
			} catch (e) {
				expect(e).toBeDefined();
			}
		});
	});

	describe('updateNewsletterPreferences', () => {
		it('should return null when the user has no emailadress', async () => {
			const userInfo = mockUserInfo;
			userInfo.email = null;
			const result = await campaignMonitorService.updateNewsletterPreferences(userInfo, {
				newsletter: true,
			});
			expect(result).toEqual(null);
			userInfo.email = 'test@example.com';
		});

		it('should throw an error when CM throws an error', async () => {
			campaignMonitorService.makeCmApiRequest = jest.fn().mockRejectedValueOnce('');

			try {
				await campaignMonitorService.updateNewsletterPreferences(mockUserInfo, {
					newsletter: true,
				});
				fail(
					new Error(
						'updateNewsletterPreferences should have thrown an error when CM throws an error'
					)
				);
			} catch (e) {
				expect(e).toBeDefined();
			}
		});

		it('should succesfully update newsletterPrefferences when newsletter is false', async () => {
			campaignMonitorService.makeCmApiRequest = jest.fn().mockResolvedValueOnce({});

			try {
				await campaignMonitorService.updateNewsletterPreferences(mockUserInfo, {
					newsletter: false,
				});
			} catch (e) {
				expect(e).toBeUndefined();
			}
		});

		it('should succesfully update newsletterPrefferences when newsletter is true', async () => {
			campaignMonitorService.makeCmApiRequest = jest.fn().mockResolvedValueOnce({});

			try {
				await campaignMonitorService.updateNewsletterPreferences(mockUserInfo, {
					newsletter: true,
				});
			} catch (e) {
				expect(e).toBeUndefined();
			}
		});

		it('should succesfully update newsletterPrefferences when no preferences are given (sync on login)', async () => {
			campaignMonitorService.makeCmApiRequest = jest.fn().mockResolvedValueOnce({});

			try {
				await campaignMonitorService.updateNewsletterPreferences(mockUserInfo, null);
			} catch (e) {
				expect(e).toBeUndefined();
			}
		});
	});

	describe('convertToConfirmationEmailTemplateData', () => {
		it('should parse CampaignMonitorNewsletterUpdatePreferencesQueryDto to correct template data', () => {
			const result = campaignMonitorService.convertToConfirmationEmailTemplateData(
				mockNewsletterUpdatePreferencesQueryDto
			);
			expect(result).toEqual(mockConfirmationData);
		});
	});

	describe('sendConfirmationMail', () => {
		it('should fail to send confirmation mail when mail is empty', async () => {
			const preferences = mockNewsletterUpdatePreferencesQueryDto;
			preferences.mail = null;
			try {
				await campaignMonitorService.sendConfirmationMail(preferences, Locale.Nl);
			} catch (err) {
				expect(err.name).toEqual('BadRequestException');
			}
			preferences.mail = 'test@example.com';
		});

		it('should fail to send confirmation mail when firstname or lastname is empty', async () => {
			const preferences = mockNewsletterUpdatePreferencesQueryDto;
			preferences.firstName = null;
			try {
				await campaignMonitorService.sendConfirmationMail(preferences, Locale.Nl);
			} catch (err) {
				expect(err.name).toEqual('BadRequestException');
			}
			preferences.firstName = 'test';
		});

		it('should successfully send confirmation mail when all data is valid', async () => {
			campaignMonitorService.makeCmApiRequest = jest.fn().mockResolvedValueOnce([
				{
					Status: 'Accepted',
					MessageID: '91206192-c71c-11ed-8c12-c59c777888d7',
					Recipient: 'test@example.com',
				},
			]);

			try {
				await campaignMonitorService.sendConfirmationMail(
					mockNewsletterUpdatePreferencesQueryDto,
					Locale.Nl
				);
			} catch (err) {
				expect(err).toBeUndefined;
			}
		});
	});

	describe('confirmEmail', () => {
		it('should throw an error when the token and email do not match', async () => {
			const mockData = mockSendMailQueryDto;
			mockData.mail = 'invalid@mail.com';

			try {
				await campaignMonitorService.confirmEmail(mockData);
				fail('confirmEmail should have thrown an error when token and email do not match');
			} catch (err) {
				expect(err.message).toEqual('token is invalid');
			}
			mockData.mail = 'test@example.com';
		});

		it('should update newsletter preferences when token and email match', async () => {
			campaignMonitorService.makeCmApiRequest = jest.fn().mockResolvedValueOnce({});

			try {
				await campaignMonitorService.confirmEmail(mockSendMailQueryDto);
			} catch (err) {
				expect(err).toBeUndefined();
			}
		});
	});
});
