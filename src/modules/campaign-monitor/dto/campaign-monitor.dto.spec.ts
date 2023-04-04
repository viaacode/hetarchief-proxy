import {
	CampaignMonitorConfirmationData,
	CampaignMonitorConfirmMailQueryDto,
	CampaignMonitorData,
	CampaignMonitorMaterialRequestData,
	CampaignMonitorNewsletterPreferencesDto,
	CampaignMonitorNewsletterPreferencesQueryDto,
	CampaignMonitorNewsletterUpdatePreferencesQueryDto,
	CampaignMonitorSendMailDto,
	CampaignMonitorUpdatePreferencesData,
	CampaignMonitorVisitData,
	RequestListItem,
} from './campaign-monitor.dto';

describe('CampaignMonitorDto', () => {
	describe('CampaignMonitorVisitData', () => {
		it('should be able to construct a CampaignMonitorVisitData object', async () => {
			const campaignMonitorVisitData = new CampaignMonitorVisitData();
			expect(campaignMonitorVisitData).toEqual({});
		});
	});
	describe('CampaignMonitorMaterialRequestData', () => {
		it('should be able to construct a CampaignMonitorMaterialRequestData object', async () => {
			const campaignMonitorMaterialRequestData = new CampaignMonitorMaterialRequestData();
			expect(campaignMonitorMaterialRequestData).toEqual({});
		});
	});
	describe('CampaignMonitorConfirmationData', () => {
		it('should be able to construct a CampaignMonitorConfirmationData object', async () => {
			const campaignMonitorConfirmationData = new CampaignMonitorConfirmationData();
			expect(campaignMonitorConfirmationData).toEqual({});
		});
	});
	describe('CampaignMonitorUpdatePreferencesData', () => {
		it('should be able to construct a CampaignMonitorUpdatePreferencesData object', async () => {
			const campaignMonitorUpdatePreferencesData = new CampaignMonitorUpdatePreferencesData();
			expect(campaignMonitorUpdatePreferencesData).toEqual({});
		});
	});
	describe('RequestListItem', () => {
		it('should be able to construct a RequestListItem object', async () => {
			const requestListItem = new RequestListItem();
			expect(requestListItem).toEqual({});
		});
	});
	describe('RequestListItem', () => {
		it('should be able to construct a RequestListItem object', async () => {
			const requestListItem = new RequestListItem();
			expect(requestListItem).toEqual({});
		});
	});
	describe('CampaignMonitorData', () => {
		it('should be able to construct a CampaignMonitorData object', async () => {
			const campaignMonitorData = new CampaignMonitorData();
			expect(campaignMonitorData).toEqual({});
		});
	});
	describe('CampaignMonitorSendMailDto', () => {
		it('should be able to construct a CampaignMonitorSendMailDto object', async () => {
			const sendMailDto = new CampaignMonitorSendMailDto();
			expect(sendMailDto).toEqual({});
		});
	});
	describe('CampaignMonitorNewsletterPreferencesQueryDto', () => {
		it('should be able to construct a CampaignMonitorNewsletterPreferencesQueryDto object', async () => {
			const campaignMonitorNewsletterPreferencesQueryDto =
				new CampaignMonitorNewsletterPreferencesQueryDto();
			expect(campaignMonitorNewsletterPreferencesQueryDto).toEqual({});
		});
	});
	describe('CampaignMonitorNewsletterPreferencesDto', () => {
		it('should be able to construct a CampaignMonitorNewsletterPreferencesDto object', async () => {
			const campaignMonitorNewsletterPreferencesDto =
				new CampaignMonitorNewsletterPreferencesDto();
			expect(campaignMonitorNewsletterPreferencesDto).toEqual({});
		});
	});
	describe('CampaignMonitorNewsletterUpdatePreferencesQueryDto', () => {
		it('should be able to construct a CampaignMonitorNewsletterUpdatePreferencesQueryDto object', async () => {
			const campaignMonitorNewsletterUpdatePreferencesQueryDto =
				new CampaignMonitorNewsletterUpdatePreferencesQueryDto();
			expect(campaignMonitorNewsletterUpdatePreferencesQueryDto).toEqual({});
		});
	});
	describe('CampaignMonitorConfirmMailQueryDto', () => {
		it('should be able to construct a CampaignMonitorConfirmMailQueryDto object', async () => {
			const campaignMonitorConfirmMailQueryDto = new CampaignMonitorConfirmMailQueryDto();
			expect(campaignMonitorConfirmMailQueryDto).toEqual({});
		});
	});
});
