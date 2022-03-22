import { CampaignMonitorData, CampaignMonitorVisitData, SendMailDto } from './campaign-monitor.dto';

describe('CampaignMonitorDto', () => {
	describe('SendMailDto', () => {
		it('should be able to construct a SendMailDto object', async () => {
			const sendMailDto = new SendMailDto();
			expect(sendMailDto).toEqual({});
		});
	});
	describe('CampaignMonitorData', () => {
		it('should be able to construct a CampaignMonitorData object', async () => {
			const campaignMonitorData = new CampaignMonitorData();
			expect(campaignMonitorData).toEqual({});
		});
	});
	describe('CampaignMonitorVisitData', () => {
		it('should be able to construct a CampaignMonitorVisitData object', async () => {
			const campaignMonitorVisitData = new CampaignMonitorVisitData();
			expect(campaignMonitorVisitData).toEqual({});
		});
	});
});
