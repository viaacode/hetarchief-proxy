import {
	CampaignMonitorData,
	CampaignMonitorSendMailDto,
	CampaignMonitorVisitData,
} from './campaign-monitor.dto';

describe('CampaignMonitorDto', () => {
	describe('CampaignMonitorSendMailDto', () => {
		it('should be able to construct a CampaignMonitorSendMailDto object', async () => {
			const sendMailDto = new CampaignMonitorSendMailDto();
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
