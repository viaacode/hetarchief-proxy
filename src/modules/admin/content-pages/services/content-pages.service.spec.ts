import { Test, TestingModule } from '@nestjs/testing';
import { addMonths } from 'date-fns';

import { ContentPagesService } from './contentPages.service';

import { mockGqlContentPage } from '~modules/contentPages/services/__mocks__/app_contentPage';
import { ContentPage, ContentPageStatus, ContentPageType } from '~modules/contentPages/types';
import { DataService } from '~modules/data/services/data.service';
import { AudienceType, Space } from '~modules/spaces/types';
import { User } from '~modules/users/types';
import { Visit, VisitStatus } from '~modules/visits/types';

const mockGqlContentPage1 = {
	description:
		'Je bezoek aanvraag aan de leeszaal van Gents museum is goedgekeurd, je hebt toegang van 12:00 to 16:00 op 17 feb 2022',
	title: 'Je bezoek aanvraag is goedgekeurd',
	id: 'b925aca7-2e57-4f8e-a46b-13625c512fc2',
	status: ContentPageStatus.UNREAD,
	recipient: 'df8024f9-ebdc-4f45-8390-72980a3f29f6',
	visit_id: '0fb12a25-a882-42f7-9c79-9d77839c7237',
	created_at: '2022-02-28T17:21:58.937169+00:00',
	updated_at: '2022-02-28T17:21:58.937169',
	type: ContentPageType.VISIT_REQUEST_APPROVED,
};

const mockGqlContentPage2 = {
	description:
		'Je bezoek aanvraag aan de leeszaal van Gents museum is goedgekeurd, je hebt toegang van 12:00 to 16:00 op 17 feb 2022',
	title: 'Je bezoek aanvraag is goedgekeurd',
	id: '84056059-c9fe-409b-844e-e7ce606c6212',
	status: ContentPageStatus.UNREAD,
	recipient: 'df8024f9-ebdc-4f45-8390-72980a3f29f6',
	visit_id: '0fb12a25-a882-42f7-9c79-9d77839c7237',
	created_at: '2022-02-25T17:21:58.937169+00:00',
	updated_at: '2022-02-25T17:21:58.937169',
	type: ContentPageType.VISIT_REQUEST_APPROVED,
};

const mockGqlContentPagesResult = {
	data: {
		app_contentPage: [mockGqlContentPage1, mockGqlContentPage2],
		app_contentPage_aggregate: {
			aggregate: {
				count: 2,
			},
		},
	},
};

const mockContentPage: ContentPage = {
	id: 'bfcae082-2370-4a2b-9f66-a55c869addfb',
	description:
		'Je bezoek aanvraag aan de leeszaal van Gents museum is goedgekeurd, je hebt toegang van 12:00 to 16:00 op 17 feb 2022',
	title: 'Je bezoek aanvraag is goedgekeurd 13',
	status: ContentPageStatus.UNREAD,
	visitId: '0fb12a25-a882-42f7-9c79-9d77839c7237',
	createdAt: '2022-02-25T17:21:58.937169+00:00',
	updatedAt: '2022-02-28T17:54:59.894586',
	type: ContentPageType.VISIT_REQUEST_APPROVED,
	readingRoomId: '52caf5a2-a6d1-4e54-90cc-1b6e5fb66a21',
};

const mockUser: User = {
	id: 'e791ecf1-e121-4c54-9d2e-34524b6467c6',
	firstName: 'Test',
	lastName: 'Testers',
	email: 'test.testers@meemoo.be',
	acceptedTosAt: '2022-01-24T17:21:58.937169+00:00',
	permissions: ['CREATE_COLLECTION'],
};

const mockVisit: Visit = {
	id: '93eedf1a-a508-4657-a942-9d66ed6934c2',
	spaceId: '3076ad4b-b86a-49bc-b752-2e1bf34778dc',
	spaceName: 'VRT',
	userProfileId: 'df8024f9-ebdc-4f45-8390-72980a3f29f6',
	timeframe: 'Binnen 3 weken donderdag van 5 to 6',
	reason: 'Ik wil graag deze zaal bezoeken 7',
	status: VisitStatus.PENDING,
	startAt: '2022-03-03T16:00:00',
	endAt: '2022-03-03T17:00:00',
	createdAt: '2022-02-11T15:28:40.676',
	updatedAt: '2022-02-11T15:28:40.676',
	visitorName: 'Marie Odhiambo',
	visitorMail: 'marie.odhiambo@example.com',
	visitorId: 'df8024f9-ebdc-4f45-8390-72980a3f29f6',
	note: {
		id: 'a40b8cd7-5973-41ee-8134-c0451ef7fb6a',
		note: 'test note',
		createdAt: '2022-01-24T17:21:58.937169+00:00',
		updatedAt: '2022-01-24T17:21:58.937169+00:00',
		authorName: 'Test Testers',
	},
};

const mockSpace: Space = {
	id: '52caf5a2-a6d1-4e54-90cc-1b6e5fb66a21',
	maintainerId: 'OR-154dn75',
	name: 'Amsab-ISG',
	description:
		'Amsab-ISG is het Instituut voor Sociale Geschiedenis. Het bewaart, ontsluit, onderzoekt en valoriseert het erfgoed van sociale en humanitaire bewegingen.',
	serviceDescription: null,
	image: null,
	color: null,
	logo: 'https://assets.viaa.be/images/OR-154dn75',
	audienceType: AudienceType.PUBLIC,
	publicAccess: false,
	contactInfo: {
		email: null,
		telephone: null,
		address: {
			street: 'Pijndersstraat 28',
			postalCode: '9000',
			locality: 'Gent',
			postOfficeBoxNumber: null,
		},
	},
	isPublished: false,
	publishedAt: null,
	createdAt: '2022-01-13T13:10:14.41978',
	updatedAt: '2022-01-13T13:10:14.41978',
};

const mockDataService: Partial<Record<keyof DataService, jest.SpyInstance>> = {
	execute: jest.fn(),
};

describe('ContentPagesService', () => {
	let contentPagesService: ContentPagesService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ContentPagesService,
				{
					provide: DataService,
					useValue: mockDataService,
				},
			],
		}).compile();

		contentPagesService = module.get<ContentPagesService>(ContentPagesService);
	});

	it('services should be defined', () => {
		expect(contentPagesService).toBeDefined();
	});

	describe('adapt', () => {
		it('should adapt a graphql contentPage response to our contentPage interface', () => {
			const adapted = contentPagesService.adaptContentPage(mockGqlContentPage);
			// test some sample keys
			expect(adapted.id).toEqual(mockGqlContentPage.id);
			expect(adapted.type).toEqual(mockGqlContentPage.type);
			expect(adapted.visitId).toEqual(mockGqlContentPage.visit_id);
		});
		it('should return undefined in the gql contentPage is undefined', () => {
			const adapted = contentPagesService.adaptContentPage(undefined);
			expect(adapted).toBeUndefined();
		});
	});

	describe('findByUser', () => {
		it('returns a paginated response with all contentPages for a user', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockGqlContentPagesResult);
			const response = await contentPagesService.findContentPagesByUser(
				mockGqlContentPagesResult.data.app_contentPage[0].recipient,
				addMonths(new Date(), -1).toISOString(),
				1,
				20
			);
			expect(response.items.length).toBe(2);
			expect(response.page).toBe(1);
			expect(response.size).toBe(20);
			expect(response.total).toBe(2);
		});
	});

	describe('create', () => {
		it('can create a new contentPage', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: {
					insert_app_contentPage: {
						returning: [mockGqlContentPage1],
					},
				},
			});
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { id, created_at, updated_at, ...mockContentPage } = mockGqlContentPage1;
			const response = await contentPagesService.create([mockContentPage]);
			expect(response[0].id).toBe(mockGqlContentPage1.id);
		});
	});

	describe('createForMultipleRecipients', () => {
		it('can create multiple contentPages for multiple recipients', async () => {
			const createContentPagesSpy = jest
				.spyOn(contentPagesService, 'create')
				.mockResolvedValueOnce([mockContentPage, mockContentPage]);

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { id, created_at, updated_at, recipient, ...createContentPage } =
				mockGqlContentPage1;
			const response = await contentPagesService.createForMultipleRecipients(
				createContentPage,
				[recipient, recipient]
			);
			expect(response).toHaveLength(2);
			createContentPagesSpy.mockRestore();
		});
	});

	describe('onCreateVisit', () => {
		it('should send a contentPage about a visit request creation', async () => {
			const createForMultipleRecipientsSpy = jest
				.spyOn(contentPagesService, 'createForMultipleRecipients')
				.mockResolvedValueOnce([mockContentPage]);

			const response = await contentPagesService.onCreateVisit(
				mockVisit,
				[mockUser.id],
				mockUser
			);

			expect(response).toHaveLength(1);
			expect(response[0].status).toEqual(ContentPageStatus.UNREAD);
			createForMultipleRecipientsSpy.mockRestore();
		});
	});

	describe('onApproveVisitRequest', () => {
		it('should send a contentPage about a visit request approval', async () => {
			const createContentPageSpy = jest
				.spyOn(contentPagesService, 'create')
				.mockResolvedValueOnce([mockContentPage]);

			const response = await contentPagesService.onApproveVisitRequest(
				mockVisit,
				mockSpace,
				mockUser
			);

			expect(response.status).toEqual(ContentPageStatus.UNREAD);
			createContentPageSpy.mockRestore();
		});
	});

	describe('onDenyVisitRequest', () => {
		it('should send a contentPage about a visit request denial', async () => {
			const createContentPageSpy = jest
				.spyOn(contentPagesService, 'create')
				.mockResolvedValueOnce([mockContentPage]);

			const response = await contentPagesService.onDenyVisitRequest(
				mockVisit,
				mockSpace,
				mockUser
			);

			expect(response.status).toEqual(ContentPageStatus.UNREAD);
			createContentPageSpy.mockRestore();
		});
	});

	describe('update', () => {
		it('should update a contentPage', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: {
					update_app_contentPage: {
						returning: [mockGqlContentPage1],
					},
				},
			});
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { id, created_at, updated_at, ...mockContentPage } = mockGqlContentPage1;
			const response = await contentPagesService.update(id, mockUser.id, mockContentPage);
			expect(response.id).toBe(mockGqlContentPage1.id);
		});

		it('should not update a contentPage if you are not the recipient', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: {
					update_app_contentPage: {
						returning: [],
					},
				},
			});
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { id, created_at, updated_at, ...mockContentPage } = mockGqlContentPage1;
			let error;
			try {
				await contentPagesService.update(id, mockUser.id, mockContentPage);
			} catch (err) {
				error = err;
			}
			expect(error.response).toEqual({
				statusCode: 404,
				message: 'ContentPage not found or you are not the contentPages recipient.',
				error: 'Not Found',
			});
		});
	});

	describe('updateAll', () => {
		it('can update all contentPages of a specific user', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: {
					update_app_contentPage: {
						affectedRows: 5,
					},
				},
			});
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { id, created_at, updated_at, ...mockContentPage } = mockGqlContentPage1;
			const affectedRows = await contentPagesService.updateAll(mockUser.id, mockContentPage);
			expect(affectedRows).toBe(5);
		});
	});
});
