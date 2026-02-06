import { DataService, VideoStillsService } from '@meemoo/admin-core-api';
import { Test, type TestingModule } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it, type MockInstance, vi } from 'vitest';

import { CampaignMonitorService } from '../../campaign-monitor/services/campaign-monitor.service';
import { MaterialRequestType } from '../material-requests.types';
import {
	mockGqlMaintainers,
	mockGqlMaterialRequest1,
	mockGqlMaterialRequest2,
	mockMaintainerWithMaterialRequest,
	mockUser,
	mockUserProfileId,
} from '../mocks/material-requests.mocks';

import { MaterialRequestsService } from './material-requests.service';

import type {
	DeleteMaterialRequestMutation,
	FindMaintainersWithMaterialRequestsQuery,
	FindMaterialRequestsByIdQuery,
	FindMaterialRequestsQuery,
	InsertMaterialRequestMutation,
	UpdateMaterialRequestMutation,
} from '~generated/graphql-db-types-hetarchief';
import { IeObjectLicense, IeObjectsVisitorSpaceInfo } from '~modules/ie-objects/ie-objects.types';
import { IeObjectsService } from '~modules/ie-objects/services/ie-objects.service';
import { MediahavenJobsWatcherService } from '~modules/mediahaven-jobs-watcher/services/mediahaven-jobs-watcher.service';
import { mockOrganisations } from '~modules/organisations/mocks/organisations.mocks';
import { OrganisationsService } from '~modules/organisations/services/organisations.service';
import { SpacesService } from '~modules/spaces/services/spaces.service';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { UsersService } from '~modules/users/services/users.service';
import { TestingLogger } from '~shared/logging/test-logger';

const mockDataService: Partial<Record<keyof DataService, MockInstance>> = {
	execute: vi.fn(),
};

const mockCampaignMonitorService: Partial<Record<keyof CampaignMonitorService, MockInstance>> = {
	sendTransactionalMail: vi.fn(),
};

const mockOrganisationsService: Partial<Record<keyof OrganisationsService, MockInstance>> = {
	findOrganisationsBySchemaIdentifiers: vi.fn(),
};

const mockSpacesService: Partial<Record<keyof SpacesService, MockInstance>> = {
	adaptEmail: vi.fn(() => 'test@email.be'),
	adaptTelephone: vi.fn(() => '555 55 55 55'),
};

const getDefaultMaterialRequestsResponse = (): {
	app_material_requests: FindMaterialRequestsQuery[];
	app_material_requests_aggregate: { aggregate: { count: number } };
} => ({
	app_material_requests: [mockGqlMaterialRequest1 as any],
	app_material_requests_aggregate: {
		aggregate: {
			count: 100,
		},
	},
});

const mockIeObjectsService: Partial<Record<keyof IeObjectsService, MockInstance>> = {
	getThumbnailUrlWithToken: vi.fn((thumbnail) => thumbnail),
	findMetadataByIeObjectId: vi.fn(() => ({
		licenses: [IeObjectLicense.PUBLIC_DOMAIN, IeObjectLicense.PUBLIEK_CONTENT],
	})),
	getVisitorSpaceAccessInfoFromUser: vi.fn(() => ({ objectIds: [], visitorSpaceIds: [] })),
	adaptRepresentations: vi.fn(() => []),
};

const mockVideoStillsService: Partial<Record<keyof VideoStillsService, MockInstance>> = {
	getFirstVideoStills: vi.fn(() => []),
};

const mockIeObjectsVisitorSpaceInfo: IeObjectsVisitorSpaceInfo = {
	objectIds: [],
	visitorSpaceIds: [],
};

const mockMediahavenJobsWatcherService: Partial<
	Record<keyof MediahavenJobsWatcherService, MockInstance>
> = {
	checkJobs: vi.fn(() => Promise.resolve()),
	createExportJob: vi.fn(() => Promise.resolve('mock-job-id')),
};

const mockUsersService: Partial<Record<keyof UsersService, MockInstance>> = {
	getUserByIdentityId: vi.fn(),
	createUserWithIdp: vi.fn(),
	updateUser: vi.fn(),
};

const getDefaultMaterialRequestByIdResponse = (): {
	app_material_requests: FindMaterialRequestsByIdQuery[];
	app_material_requests_aggregate: { aggregate: { count: number } };
} => ({
	app_material_requests: [mockGqlMaterialRequest2 as any],
	app_material_requests_aggregate: {
		aggregate: {
			count: 100,
		},
	},
});

const getDefaultMaintainersWithMaterialRequestsResponse = (): {
	graph_organisations_with_material_requests: FindMaintainersWithMaterialRequestsQuery[];
	graph_organisations_with_material_requests_aggregate: { aggregate: { count: number } };
} => ({
	graph_organisations_with_material_requests: [mockGqlMaintainers as any],
	graph_organisations_with_material_requests_aggregate: {
		aggregate: {
			count: 100,
		},
	},
});

describe('MaterialRequestsService', () => {
	let materialRequestsService: MaterialRequestsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				MaterialRequestsService,
				{
					provide: DataService,
					useValue: mockDataService,
				},
				{
					provide: CampaignMonitorService,
					useValue: mockCampaignMonitorService,
				},
				{
					provide: OrganisationsService,
					useValue: mockOrganisationsService,
				},
				{
					provide: SpacesService,
					useValue: mockSpacesService,
				},
				{
					provide: SpacesService,
					useValue: mockSpacesService,
				},
				{
					provide: IeObjectsService,
					useValue: mockIeObjectsService,
				},
				{
					provide: IeObjectsService,
					useValue: mockIeObjectsService,
				},
				{
					provide: VideoStillsService,
					useValue: mockVideoStillsService,
				},
				{
					provide: MediahavenJobsWatcherService,
					useValue: mockMediahavenJobsWatcherService,
				},
				{
					provide: UsersService,
					useValue: mockUsersService,
				},
			],
		})
			.setLogger(new TestingLogger())
			.compile();

		materialRequestsService = module.get<MaterialRequestsService>(MaterialRequestsService);
	});

	afterEach(() => {
		mockDataService.execute.mockRestore();
	});

	it('services should be defined', () => {
		expect(materialRequestsService).toBeDefined();
	});

	describe('adapt', () => {
		it('can adapt a FindMaterialRequestsQuery hasura response to our material request interface', async () => {
			const adapted = await materialRequestsService.adapt(
				mockGqlMaterialRequest1,
				mockOrganisations,
				mockIeObjectsVisitorSpaceInfo,
				new SessionUserEntity(mockUser),
				'referer',
				''
			);
			// test some sample keys
			expect(adapted.id).toEqual(mockGqlMaterialRequest1.id);
			expect(adapted.objectId).toEqual(mockGqlMaterialRequest1.ie_object_id);
			expect(adapted.profileId).toEqual(mockGqlMaterialRequest1.profile_id);
			expect(adapted.reason).toEqual(mockGqlMaterialRequest1.reason);
			// requestedBy
			expect(adapted.requesterId).toEqual(mockGqlMaterialRequest1.requested_by.id);
			expect(adapted.requesterFullName).toEqual(mockGqlMaterialRequest1.requested_by.full_name);
			expect(adapted.requesterMail).toEqual(mockGqlMaterialRequest1.requested_by.mail);
			// maintainer
			expect(adapted.maintainerId).toEqual(
				mockGqlMaterialRequest1.intellectualEntity.schemaMaintainer.org_identifier
			);
			expect(adapted.maintainerName).toEqual(
				mockGqlMaterialRequest1.intellectualEntity.schemaMaintainer.skos_pref_label
			);
			expect(adapted.maintainerSlug).toEqual(
				mockGqlMaterialRequest1.intellectualEntity.schemaMaintainer.visitorSpace.slug
			);
			expect(adapted.reuseForm).toEqual(mockGqlMaterialRequest1.material_request_reuse_form_values);
		});

		it('can adapt a FindMaterialRequestsByIdQuery hasura response to our material request interface', async () => {
			const adapted = await materialRequestsService.adapt(
				mockGqlMaterialRequest2,
				mockOrganisations,
				mockIeObjectsVisitorSpaceInfo,
				new SessionUserEntity(mockUser),
				'referer',
				''
			);
			// test some sample keys
			expect(adapted.id).toEqual(mockGqlMaterialRequest2.id);
			expect(adapted.objectId).toEqual(mockGqlMaterialRequest2.ie_object_id);
			expect(adapted.profileId).toEqual(mockGqlMaterialRequest2.profile_id);
			expect(adapted.reason).toEqual(mockGqlMaterialRequest2.reason);
			// requestedBy
			expect(adapted.requesterId).toEqual(mockGqlMaterialRequest2.requested_by.id);
			expect(adapted.requesterFullName).toEqual(mockGqlMaterialRequest2.requested_by.full_name);
			expect(adapted.requesterMail).toEqual(mockGqlMaterialRequest2.requested_by.mail);
			// requestedBy.group
			expect(adapted.requesterUserGroupId).toEqual(mockGqlMaterialRequest2.requested_by.group.id);
			expect(adapted.requesterUserGroupDescription).toEqual(
				mockGqlMaterialRequest2.requested_by.group.description
			);
			expect(adapted.requesterUserGroupLabel).toEqual(
				mockGqlMaterialRequest2.requested_by.group.label
			);
			expect(adapted.requesterUserGroupName).toEqual(
				mockGqlMaterialRequest2.requested_by.group.name
			);
			// maintainer
			expect(adapted.maintainerId).toEqual(
				mockGqlMaterialRequest2.intellectualEntity.schemaMaintainer.org_identifier
			);
			expect(adapted.maintainerName).toEqual(
				mockGqlMaterialRequest2.intellectualEntity.schemaMaintainer.skos_pref_label
			);
			expect(adapted.maintainerSlug).toEqual(
				mockGqlMaterialRequest2.intellectualEntity.schemaMaintainer.visitorSpace.slug
			);
			expect(adapted.maintainerLogo).toEqual(
				mockGqlMaterialRequest2.intellectualEntity.schemaMaintainer.ha_org_has_logo
			);
			// object
			expect(adapted.objectSchemaName).toEqual(
				mockGqlMaterialRequest2.intellectualEntity.schema_name
			);
			expect(adapted.objectDctermsFormat).toEqual(
				mockGqlMaterialRequest2.intellectualEntity.dctermsFormat[0].dcterms_format
			);
			expect(adapted.objectThumbnailUrl).toEqual(
				mockGqlMaterialRequest2.intellectualEntity.schemaThumbnail.schema_thumbnail_url[0]
			);
			expect(adapted.reuseForm).toEqual({
				representationId: mockGqlMaterialRequest2.material_request_reuse_form_values[0].value,
				startTime: null,
				endTime: 2000,
				downloadQuality: mockGqlMaterialRequest2.material_request_reuse_form_values[3].value,
				intendedUsage: mockGqlMaterialRequest2.material_request_reuse_form_values[4].value,
				intendedUsageDescription:
					mockGqlMaterialRequest2.material_request_reuse_form_values[5].value,
				distributionAccess: mockGqlMaterialRequest2.material_request_reuse_form_values[6].value,
				distributionType: mockGqlMaterialRequest2.material_request_reuse_form_values[7].value,
				materialEditing: mockGqlMaterialRequest2.material_request_reuse_form_values[8].value,
				geographicalUsage: mockGqlMaterialRequest2.material_request_reuse_form_values[9].value,
				timeUsageType: mockGqlMaterialRequest2.material_request_reuse_form_values[10].value,
				copyrightDisplay: mockGqlMaterialRequest2.material_request_reuse_form_values[11].value,
			});
		});

		it('should return null when the material request does not exist', async () => {
			const adapted = await materialRequestsService.adapt(
				undefined,
				mockOrganisations,
				mockIeObjectsVisitorSpaceInfo,
				new SessionUserEntity(mockUser),
				'referer',
				''
			);
			// test some sample keys
			expect(adapted).toBeNull();
		});

		it('returns null on invalid input', async () => {
			const adapted = await materialRequestsService.adapt(
				null,
				mockOrganisations,
				mockIeObjectsVisitorSpaceInfo,
				new SessionUserEntity(mockUser),
				'referer',
				''
			);
			expect(adapted).toBeNull();
		});
	});

	describe('findAll', () => {
		it('returns a paginated response with all material requests', async () => {
			mockOrganisationsService.findOrganisationsBySchemaIdentifiers.mockResolvedValue(
				mockOrganisations
			);
			mockDataService.execute.mockResolvedValueOnce(getDefaultMaterialRequestsResponse());
			const response = await materialRequestsService.findAll(
				{
					page: 1,
					size: 10,
				},
				false,
				new SessionUserEntity(mockUser),
				'referer',
				''
			);
			expect(response.items.length).toBe(1);
			expect(response.page).toBe(1);
			expect(response.size).toBe(10);
			expect(response.total).toBe(100);
		});

		it('returns a paginated response with material requests containing Ilya', async () => {
			mockOrganisationsService.findOrganisationsBySchemaIdentifiers.mockResolvedValue(
				mockOrganisations
			);
			mockDataService.execute.mockResolvedValueOnce(getDefaultMaterialRequestsResponse());
			const response = await materialRequestsService.findAll(
				{
					query: '%Ilya%',
					page: 1,
					size: 10,
				},
				false,
				new SessionUserEntity(mockUser),
				'referer',
				''
			);
			expect(response.items.length).toBe(1);
			expect(response.items[0]?.requesterFullName).toContain('Ilya Korsakov');
			expect(response.items[0]?.requesterMail).toEqual('ilya.korsakov@example.com');
			expect(response.page).toBe(1);
			expect(response.size).toBe(10);
			expect(response.total).toBe(100);
		});

		it('can filter on type "REUSE"', async () => {
			mockOrganisationsService.findOrganisationsBySchemaIdentifiers.mockResolvedValue(
				mockOrganisations
			);
			mockDataService.execute.mockResolvedValueOnce(getDefaultMaterialRequestsResponse());
			const response = await materialRequestsService.findAll(
				{
					type: MaterialRequestType.REUSE,
					page: 1,
					size: 10,
				},
				false,
				new SessionUserEntity(mockUser),
				'referer',
				''
			);
			expect(response.items.length).toBe(1);
			expect(response.items[0]?.type).toContain(MaterialRequestType.REUSE);
			expect(response.page).toBe(1);
			expect(response.size).toBe(10);
			expect(response.total).toBe(100);
		});

		it('can filter on an array of materialIds', async () => {
			mockOrganisationsService.findOrganisationsBySchemaIdentifiers.mockResolvedValue(
				mockOrganisations
			);
			mockDataService.execute.mockResolvedValueOnce(getDefaultMaterialRequestsResponse());
			const response = await materialRequestsService.findAll(
				{
					maintainerIds: ['OR-rf5kf25'],
					page: 1,
					size: 10,
				},
				false,
				new SessionUserEntity(mockUser),
				'referer',
				''
			);
			expect(response.items.length).toBe(1);
			expect(response.items[0]?.maintainerName).toEqual('VRT');
		});

		it('can filter on userProfileId', async () => {
			mockOrganisationsService.findOrganisationsBySchemaIdentifiers.mockResolvedValue(
				mockOrganisations
			);
			mockDataService.execute.mockResolvedValueOnce(getDefaultMaterialRequestsResponse());
			const response = await materialRequestsService.findAll(
				{
					page: 1,
					size: 10,
				},
				false,
				new SessionUserEntity({
					...mockUser,
					id: mockUserProfileId,
				}),
				'referer',
				''
			);
			expect(response.items.length).toBe(1);
			expect(response.page).toBe(1);
			expect(response.size).toBe(10);
			expect(response.total).toBe(100);
		});
	});

	describe('findById', () => {
		it('returns a single material request', async () => {
			mockDataService.execute.mockResolvedValueOnce(getDefaultMaterialRequestByIdResponse());
			const response = await materialRequestsService.findById(
				'1',
				new SessionUserEntity(mockUser),
				'referer',
				''
			);
			expect(response.id).toBe(mockGqlMaterialRequest2.id);
		});

		it('throws a notfoundexception if the material request was not found', async () => {
			mockOrganisationsService.findOrganisationsBySchemaIdentifiers.mockResolvedValue(
				mockOrganisations
			);
			const mockData: FindMaterialRequestsQuery = {
				app_material_requests: [],
				app_material_requests_aggregate: {
					aggregate: {
						count: 0,
					},
				},
			};
			mockDataService.execute.mockResolvedValueOnce(mockData);

			try {
				await materialRequestsService.findById(
					'unknown-id',
					new SessionUserEntity(mockUser),
					'referer',
					''
				);
			} catch (error) {
				expect(error.response).toEqual({
					error: 'Not Found',
					message: "Material Request with id 'unknown-id' not found",
					statusCode: 404,
				});
			}
		});
	});

	describe('findMaintainers', () => {
		it('returns maintainers for existing material requests', async () => {
			mockDataService.execute.mockResolvedValueOnce(
				getDefaultMaintainersWithMaterialRequestsResponse()
			);
			const response = await materialRequestsService.findMaintainers();

			expect(response[0].id).toBe(mockMaintainerWithMaterialRequest[0].id);
			expect(response[0].name).toBe(mockMaintainerWithMaterialRequest[0].name);
		});
	});

	describe('create', () => {
		it('can create a new material request', async () => {
			mockOrganisationsService.findOrganisationsBySchemaIdentifiers.mockResolvedValue(
				mockOrganisations
			);
			const mockData: InsertMaterialRequestMutation = {
				insert_app_material_requests_one: mockGqlMaterialRequest1,
			};
			mockDataService.execute.mockResolvedValueOnce(mockData);
			const response = await materialRequestsService.createMaterialRequest(
				{
					objectSchemaIdentifier: mockGqlMaterialRequest1.ie_object_id,
					reason: mockGqlMaterialRequest1.reason,
					type: mockGqlMaterialRequest1.type,
					requesterCapacity: mockGqlMaterialRequest1.requester_capacity,
					reuseForm: undefined,
				},
				new SessionUserEntity({
					...mockUser,
					id: 'e1d792cc-4624-48cb-aab3-80ef90521b54',
				}),
				'referer',
				''
			);
			expect(response.id).toBe(mockGqlMaterialRequest1.id);
		});
	});

	describe('update', () => {
		it('can update a material request', async () => {
			mockOrganisationsService.findOrganisationsBySchemaIdentifiers.mockResolvedValue(
				mockOrganisations
			);
			const mockData: UpdateMaterialRequestMutation = {
				update_app_material_requests: {
					returning: [mockGqlMaterialRequest1 as any],
				},
			};
			mockDataService.execute.mockResolvedValueOnce(mockData);
			mockOrganisationsService.findOrganisationsBySchemaIdentifiers.mockResolvedValue(
				mockOrganisations
			);
			const response = await materialRequestsService.updateMaterialRequestForUser(
				mockGqlMaterialRequest1.id,
				new SessionUserEntity({
					...mockUser,
					id: mockGqlMaterialRequest1.profile_id,
				}),
				{
					type: mockGqlMaterialRequest1.type,
					reason: mockGqlMaterialRequest1.reason,
				},
				undefined,
				'referer',
				''
			);
			expect(response.id).toBe(mockGqlMaterialRequest1.id);
		});
	});

	describe('delete', () => {
		it('can delete a material request', async () => {
			const mockData: DeleteMaterialRequestMutation = {
				delete_app_material_requests: {
					affected_rows: 1,
				},
			};
			mockDataService.execute.mockResolvedValueOnce(mockData);
			const { id, profile_id } = mockGqlMaterialRequest1;
			const affectedRows = await materialRequestsService.deleteMaterialRequest(id, profile_id);
			expect(affectedRows).toBe(1);
		});

		it('can delete a non existing material request', async () => {
			const mockData: DeleteMaterialRequestMutation = {
				delete_app_material_requests: {
					affected_rows: 0,
				},
			};
			mockDataService.execute.mockResolvedValueOnce(mockData);
			const { profile_id } = mockGqlMaterialRequest1;
			const affectedRows = await materialRequestsService.deleteMaterialRequest(
				'unknown-id',
				profile_id
			);
			expect(affectedRows).toBe(0);
		});
	});
});
