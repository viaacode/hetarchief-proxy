import { DataService } from '@meemoo/admin-core-api';
import { Test, type TestingModule } from '@nestjs/testing';

import { CampaignMonitorService } from '../../campaign-monitor/services/campaign-monitor.service';
import { MaterialRequestType } from '../material-requests.types';
import {
	mockGqlMaintainers,
	mockGqlMaterialRequest1,
	mockGqlMaterialRequest2,
	mockMaintainerWithMaterialRequest,
	mockUserProfileId,
} from '../mocks/material-requests.mocks';

import { MaterialRequestsService } from './material-requests.service';

import {
	type DeleteMaterialRequestMutation,
	type FindMaintainersWithMaterialRequestsQuery,
	type FindMaterialRequestsByIdQuery,
	type FindMaterialRequestsQuery,
	type InsertMaterialRequestMutation,
	type UpdateMaterialRequestMutation,
} from '~generated/graphql-db-types-hetarchief';
import { mockOrganisations } from '~modules/organisations/mocks/organisations.mocks';
import { OrganisationsService } from '~modules/organisations/services/organisations.service';
import { SpacesService } from '~modules/spaces/services/spaces.service';
import { TestingLogger } from '~shared/logging/test-logger';

const mockDataService: Partial<Record<keyof DataService, jest.SpyInstance>> = {
	execute: jest.fn(),
};

const mockCampaignMonitorService: Partial<Record<keyof CampaignMonitorService, jest.SpyInstance>> =
	{
		sendTransactionalMail: jest.fn(),
	};

const mockOrganisationsService: Partial<Record<keyof OrganisationsService, jest.SpyInstance>> = {
	findOrganisationsBySchemaIdentifiers: jest.fn(),
};

const mockSpacesService: Partial<Record<keyof SpacesService, jest.SpyInstance>> = {
	adaptEmail: jest.fn(() => 'test@email.be'),
	adaptTelephone: jest.fn(() => '555 55 55 55'),
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
	maintainer_organisations_with_material_requests: FindMaintainersWithMaterialRequestsQuery[];
	maintainer_organisations_with_material_requests_aggregate: { aggregate: { count: number } };
} => ({
	maintainer_organisations_with_material_requests: [mockGqlMaintainers as any],
	maintainer_organisations_with_material_requests_aggregate: {
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
		it('can adapt a FindMaterialRequestsQuery hasura response to our material request interface', () => {
			const adapted = materialRequestsService.adapt(
				mockGqlMaterialRequest1,
				mockOrganisations
			);
			// test some sample keys
			expect(adapted.id).toEqual(mockGqlMaterialRequest1.id);
			expect(adapted.objectSchemaIdentifier).toEqual(
				mockGqlMaterialRequest1.object_schema_identifier
			);
			expect(adapted.profileId).toEqual(mockGqlMaterialRequest1.profile_id);
			expect(adapted.reason).toEqual(mockGqlMaterialRequest1.reason);
			// requestedBy
			expect(adapted.requesterId).toEqual(mockGqlMaterialRequest1.requested_by.id);
			expect(adapted.requesterFullName).toEqual(
				mockGqlMaterialRequest1.requested_by.full_name
			);
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
		});

		it('can adapt a FindMaterialRequestsByIdQuery hasura response to our material request interface', () => {
			const adapted = materialRequestsService.adapt(
				mockGqlMaterialRequest2,
				mockOrganisations
			);
			// test some sample keys
			expect(adapted.id).toEqual(mockGqlMaterialRequest2.id);
			expect(adapted.objectSchemaIdentifier).toEqual(
				mockGqlMaterialRequest2.object_schema_identifier
			);
			expect(adapted.profileId).toEqual(mockGqlMaterialRequest2.profile_id);
			expect(adapted.reason).toEqual(mockGqlMaterialRequest2.reason);
			// requestedBy
			expect(adapted.requesterId).toEqual(mockGqlMaterialRequest2.requested_by.id);
			expect(adapted.requesterFullName).toEqual(
				mockGqlMaterialRequest2.requested_by.full_name
			);
			expect(adapted.requesterMail).toEqual(mockGqlMaterialRequest2.requested_by.mail);
			// requestedBy.group
			expect(adapted.requesterUserGroupId).toEqual(
				mockGqlMaterialRequest2.requested_by.group.id
			);
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
				mockGqlMaterialRequest2.intellectualEntity.dcterms_format
			);
			expect(adapted.objectThumbnailUrl).toEqual(
				mockGqlMaterialRequest2.intellectualEntity.schema_thumbnail_url[0]
			);
		});

		it('should return null when the material request does not exist', () => {
			const adapted = materialRequestsService.adapt(undefined, mockOrganisations);
			// test some sample keys
			expect(adapted).toBeNull();
		});

		it('returns null on invalid input', () => {
			const adapted = materialRequestsService.adapt(null, mockOrganisations);
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
				{}
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
				{}
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
				{}
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
				{}
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
				{ userProfileId: mockUserProfileId }
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
			const response = await materialRequestsService.findById('1');
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
				await materialRequestsService.findById('unknown-id');
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
					objectId: mockGqlMaterialRequest1.object_schema_identifier,
					reason: mockGqlMaterialRequest1.reason,
					type: mockGqlMaterialRequest1.type,
					requesterCapacity: mockGqlMaterialRequest1.requester_capacity,
				},
				{ userProfileId: 'e1d792cc-4624-48cb-aab3-80ef90521b54' }
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
					returning: [mockGqlMaterialRequest1],
				},
			};
			mockDataService.execute.mockResolvedValueOnce(mockData);
			mockOrganisationsService.findOrganisationsBySchemaIdentifiers.mockResolvedValue(
				mockOrganisations
			);
			const response = await materialRequestsService.updateMaterialRequest(
				mockGqlMaterialRequest1.id,
				mockGqlMaterialRequest1.profile_id,
				{
					type: mockGqlMaterialRequest1.type,
					reason: mockGqlMaterialRequest1.reason,
				}
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
			const affectedRows = await materialRequestsService.deleteMaterialRequest(
				id,
				profile_id
			);
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
