import { DataService, TranslationsService } from '@meemoo/admin-core-api';
import { InternalServerErrorException } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { Idp } from '@viaa/avo2-types';
import { cloneDeep } from 'lodash';

import { CreateSpaceDto } from '../dto/spaces.dto';

import { mockGqlSpace } from './__mocks__/cp_space';
import { SpacesService } from './spaces.service';

import type {
	CreateSpaceMutation,
	FindSpaceByIdQuery,
	FindSpaceByOrganisationIdQuery,
	FindSpaceBySlugQuery,
	FindSpacesQuery,
	GetVisitorSpaceCpAdminProfilesQuery,
	UpdateSpaceMutation,
} from '~generated/graphql-db-types-hetarchief';
import {
	type GqlOrganisation,
	OrganisationContactPointType,
} from '~modules/organisations/organisations.types';
import { AccessType, VisitorSpaceOrderProps } from '~modules/spaces/spaces.types';
import { GroupId, GroupName, Permission, type User } from '~modules/users/types';
import { DuplicateKeyException } from '~shared/exceptions/duplicate-key.exception';
import { getProxyNlTranslations } from '~shared/helpers/get-proxy-nl-translations';
import { mockTranslationsService } from '~shared/helpers/mockTranslationsService';
import { TestingLogger } from '~shared/logging/test-logger';
import { SortDirection } from '~shared/types';
import { Locale, VisitorSpaceStatus } from '~shared/types/types';

const mockUser: User = {
	id: '0f5e3c9d-cf2a-4213-b888-dbf69b773c8e',
	firstName: 'Tom',
	lastName: 'Testerom',
	fullName: 'Test Testers',
	email: 'test@studiohyperdrive.be',
	language: Locale.Nl,
	acceptedTosAt: '2022-02-21T14:00:00',
	groupId: GroupId.CP_ADMIN,
	groupName: GroupName.CP_ADMIN,
	permissions: [Permission.MANAGE_CP_VISIT_REQUESTS],
	idp: Idp.HETARCHIEF,
	isKeyUser: false,
};
const mockCreateSpace: CreateSpaceDto = {
	orId: 'test',
	slug: 'test-slug',
	color: 'red',
	descriptionNl: 'mijn-bezoekersruimte',
	serviceDescriptionNl: 'service beschrijving',
	descriptionEn: 'my-space',
	serviceDescriptionEn: 'service description',
	image: '',
	status: VisitorSpaceStatus.Active,
};

const mockDataService: Partial<Record<keyof DataService, jest.SpyInstance>> = {
	execute: jest.fn(),
};

const mockFindSpacesResponse: FindSpacesQuery = {
	maintainer_visitor_space: [
		{
			id: '1',
		},
	] as FindSpacesQuery['maintainer_visitor_space'],
	maintainer_visitor_space_aggregate: {
		aggregate: {
			count: 100,
		},
	},
};

describe('SpacesService', () => {
	let spacesService: SpacesService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SpacesService,
				{
					provide: DataService,
					useValue: mockDataService,
				},
				{
					provide: TranslationsService,
					useValue: mockTranslationsService,
				},
			],
		})
			.setLogger(new TestingLogger())
			.compile();

		spacesService = module.get<SpacesService>(SpacesService);
	});

	afterEach(() => {
		mockDataService.execute.mockRestore();
	});

	it('services should be defined', () => {
		expect(spacesService).toBeDefined();
	});

	describe('adapt', () => {
		it('can adapt a hasura response to our space interface', () => {
			const adapted = spacesService.adapt(mockGqlSpace);
			// test some sample keys
			expect(adapted.id).toEqual(mockGqlSpace.id);
			expect(adapted.name).toEqual(mockGqlSpace.organisation.skos_pref_label);
			expect(adapted.logo).toEqual(mockGqlSpace.organisation.ha_org_has_logo);
			expect(adapted.contactInfo.email).toEqual(
				mockGqlSpace.organisation.schemaContactPoint[0].schema_email
			);
		});

		it('if the space description is empty it falls back to the maintainer description', () => {
			const mockCpSpace = cloneDeep(mockGqlSpace);
			mockCpSpace.schema_description_nl = 'Space specific description';

			const adapted = spacesService.adapt(mockCpSpace);

			// test some sample keys
			expect(adapted.descriptionNl).toEqual('Space specific description');
		});
	});

	describe('adaptEmail', () => {
		it('returns the correct email address', () => {
			const email = spacesService.adaptEmail([
				{
					schema_contact_type: OrganisationContactPointType.primary,
					schema_email: 'wrong@mail.be',
					schema_telephone: '051123456',
				},
				{
					schema_contact_type: OrganisationContactPointType.ontsluiting,
					schema_email: 'correct@mail.be',
					schema_telephone: '051123456',
				},
			] as GqlOrganisation['schemaContactPoint']);
			expect(email).toEqual('correct@mail.be');
		});

		it('returns null if no email address was found', () => {
			const email = spacesService.adaptEmail(undefined);
			expect(email).toBeNull();
		});
	});

	describe('update', () => {
		it('can update a space', async () => {
			const mockData: UpdateSpaceMutation = {
				update_maintainer_visitor_space_by_pk: {
					id: '1',
				} as UpdateSpaceMutation['update_maintainer_visitor_space_by_pk'],
			};
			mockDataService.execute.mockResolvedValueOnce(mockData);
			const response = await spacesService.update(
				'1',
				{
					color: 'red',
					descriptionNl: 'mijn-bezoekersruimte',
					serviceDescriptionNl: 'service beschrijving',
					descriptionEn: 'my-space',
					serviceDescriptionEn: 'service description',
					image: '',
					status: VisitorSpaceStatus.Active,
				},
				Locale.Nl
			);
			expect(response.id).toEqual('1');
		});

		it('does not crash when updating not a single value', async () => {
			const mockData: UpdateSpaceMutation = {
				update_maintainer_visitor_space_by_pk: {
					id: '1',
				} as UpdateSpaceMutation['update_maintainer_visitor_space_by_pk'],
			};
			mockDataService.execute.mockResolvedValueOnce(mockData);
			const response = await spacesService.update('1', {}, Locale.Nl);
			expect(response.id).toEqual('1');
		});

		it('throws a notfoundexception if the space was not found', async () => {
			const mockData: UpdateSpaceMutation = {
				update_maintainer_visitor_space_by_pk: null,
			};
			mockDataService.execute.mockResolvedValueOnce(mockData);
			let error: any;
			try {
				await spacesService.update('0', {}, Locale.Nl);
			} catch (e) {
				error = e;
			}
			expect(error.message).toEqual("Space with id '0' not found");
		});
	});

	describe('create', () => {
		it('can create a space', async () => {
			const mockData: CreateSpaceMutation = {
				insert_maintainer_visitor_space_one: {
					id: '1',
				} as CreateSpaceMutation['insert_maintainer_visitor_space_one'],
			};

			mockDataService.execute.mockResolvedValueOnce(mockData);

			const response = await spacesService.create(mockCreateSpace, Locale.Nl);
			expect(response.id).toEqual('1');
		});

		it('throws an Internal server exception with a specific message on duplicate orId', async () => {
			const errorData = {
				message:
					'Uniqueness violation. duplicate key value violates unique constraint "space_schema_maintainer_id_key"',
				path: 'path-to-error',
			};

			mockDataService.execute.mockImplementationOnce(() => {
				throw new DuplicateKeyException(errorData);
			});

			let error: any;
			try {
				await spacesService.create(mockCreateSpace, Locale.Nl);
			} catch (e) {
				error = e;
			}
			expect(error.message).toEqual("A space already exists for maintainer with id 'test'");
		});

		it('throws an Internal server exception with a specific message on unknown orId', async () => {
			const errorData = {
				message:
					'Foreign key violation. insert or update on table "visitor_space" violates foreign key constraint "space_schema_maintainer_id_fkey"',
				path: 'path-to-error',
			};

			mockDataService.execute.mockImplementationOnce(() => {
				throw new DuplicateKeyException(errorData);
			});

			let error: any;
			try {
				await spacesService.create(mockCreateSpace, Locale.Nl);
			} catch (e) {
				error = e;
			}
			expect(error.message).toEqual("Unknown maintainerId 'test'");
		});

		it('throws an Internal server exception with a specific message on duplicate slug', async () => {
			const errorData = {
				message:
					'Uniqueness violation. duplicate key value violates unique constraint "visitor_space_slug_key"',
				path: 'path-to-error',
			};

			mockDataService.execute.mockImplementationOnce(() => {
				throw new DuplicateKeyException(errorData);
			});
			const SITE_TRANSLATIONS = await getProxyNlTranslations();

			let error: any;
			try {
				await spacesService.create(mockCreateSpace, Locale.Nl);
			} catch (e) {
				error = e;
			}
			expect(error.message).toEqual(
				SITE_TRANSLATIONS[
					'modules/spaces/services/spaces___a-space-already-exists-with-slug-slug'
				].replace('{{slug}}', mockCreateSpace.slug)
			);
		});

		it('throws a general Internal server exception when another error occurred', async () => {
			mockDataService.execute.mockImplementationOnce(() => {
				throw new InternalServerErrorException('Unknown error');
			});

			let error: any;
			try {
				await spacesService.create(mockCreateSpace, Locale.Nl);
			} catch (e) {
				error = e;
			}
			expect(error.response).toEqual({ message: 'Internal Server Error', statusCode: 500 });
		});
	});

	describe('findAll', () => {
		it('returns a paginated response with all spaces (query undefined)', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockFindSpacesResponse);
			const response = await spacesService.findAll({ page: 1, size: 10 }, mockUser.id);
			expect(response.items.length).toBe(1);
			expect(response.page).toBe(1);
			expect(response.size).toBe(10);
			expect(response.total).toBe(100);
		});

		it('returns a paginated response with all spaces (query %)', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockFindSpacesResponse);
			const response = await spacesService.findAll({ query: '%', page: 1, size: 10 }, mockUser.id);
			expect(response.items.length).toBe(1);
			expect(response.page).toBe(1);
			expect(response.size).toBe(10);
			expect(response.total).toBe(100);
		});

		it('returns a paginated response with all spaces (query %%)', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockFindSpacesResponse);
			const response = await spacesService.findAll({ query: '%%', page: 1, size: 10 }, mockUser.id);
			expect(response.items.length).toBe(1);
			expect(response.page).toBe(1);
			expect(response.size).toBe(10);
			expect(response.total).toBe(100);
		});

		it('returns a paginated response with all spaces (query %Marie%)', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockFindSpacesResponse);
			const response = await spacesService.findAll(
				{ query: '%Marie%', page: 1, size: 10 },
				mockUser.id
			);
			expect(response.items.length).toBe(1);
			expect(response.page).toBe(1);
			expect(response.size).toBe(10);
			expect(response.total).toBe(100);
		});

		it('returns a paginated response with all spaces that are accessible', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockFindSpacesResponse);
			const response = await spacesService.findAll(
				{ accessType: AccessType.ACTIVE, page: 1, size: 10 },
				mockUser.id
			);
			expect(response.items.length).toBe(1);
			expect(response.page).toBe(1);
			expect(response.size).toBe(10);
			expect(response.total).toBe(100);
		});

		it('returns a paginated response with all spaces that are not accessible', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockFindSpacesResponse);
			const response = await spacesService.findAll(
				{ accessType: AccessType.NO_ACCESS, page: 1, size: 10 },
				mockUser.id
			);
			expect(response.items.length).toBe(1);
			expect(response.page).toBe(1);
			expect(response.size).toBe(10);
			expect(response.total).toBe(100);
		});

		it('returns an empty array response if no user is defined and the accessType is set', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockFindSpacesResponse);
			const response = await spacesService.findAll(
				{ accessType: AccessType.NO_ACCESS, page: 1, size: 20 },
				undefined
			);
			expect(response.items.length).toBe(0);
			expect(response.page).toBe(1);
			expect(response.size).toBe(20);
			expect(response.total).toBe(0);
		});

		it('can filter spaces by their status', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				maintainer_visitor_space: [
					{
						id: '1',
					},
				],
				maintainer_visitor_space_aggregate: {
					aggregate: {
						count: 100,
					},
				},
			} as FindSpacesQuery);
			const response = await spacesService.findAll(
				{ status: [VisitorSpaceStatus.Active], page: 1, size: 20 },
				undefined
			);
			expect(response.items.length).toBe(1);
			expect(response.page).toBe(1);
			expect(response.size).toBe(20);
			expect(response.total).toBe(100);
		});

		it('returns a paginated response with all spaces ordered by status', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockFindSpacesResponse);
			const response = await spacesService.findAll(
				{
					orderProp: VisitorSpaceOrderProps.Status,
					orderDirection: SortDirection.asc,
					page: 1,
					size: 10,
				},
				mockUser.id
			);
			expect(response.items.length).toBe(1);
			expect(response.page).toBe(1);
			expect(response.size).toBe(10);
			expect(response.total).toBe(100);
		});
	});

	describe('findById', () => {
		it('returns a single space', async () => {
			const mockData: FindSpaceByIdQuery = {
				maintainer_visitor_space: [
					{
						id: '1',
					},
				] as FindSpaceByIdQuery['maintainer_visitor_space'],
			};
			mockDataService.execute.mockResolvedValueOnce(mockData);
			const response = await spacesService.findById('1');
			expect(response.id).toBe('1');
		});

		it('returns null if the space was not found', async () => {
			const mockData: FindSpaceByIdQuery = {
				maintainer_visitor_space: [] as FindSpaceByIdQuery['maintainer_visitor_space'],
			};
			mockDataService.execute.mockResolvedValueOnce(mockData);

			const space = await spacesService.findById('unknown-id');
			expect(space).toBeNull();
		});
	});

	describe('findByMaintainerId', () => {
		it('returns a single space by maintainer id', async () => {
			const mockData: FindSpaceByOrganisationIdQuery = {
				maintainer_visitor_space: [
					{
						id: '1',
					},
				] as FindSpaceByOrganisationIdQuery['maintainer_visitor_space'],
			};
			mockDataService.execute.mockResolvedValueOnce(mockData);
			const response = await spacesService.findByMaintainerId('1');
			expect(response.id).toBe('1');
		});

		it('returns null if the space was not found', async () => {
			const mockData: FindSpaceByOrganisationIdQuery = {
				maintainer_visitor_space: [] as FindSpaceByOrganisationIdQuery['maintainer_visitor_space'],
			};
			mockDataService.execute.mockResolvedValueOnce(mockData);

			const space = await spacesService.findByMaintainerId('unknown-id');
			expect(space).toBeNull();
		});
	});

	describe('findBySlug', () => {
		const slug = 'slug';

		it('returns a single space by slug', async () => {
			const mockData: FindSpaceBySlugQuery = {
				maintainer_visitor_space: [
					{
						slug,
					},
				] as FindSpaceBySlugQuery['maintainer_visitor_space'],
			};
			mockDataService.execute.mockResolvedValueOnce(mockData);
			const response = await spacesService.findBySlug(slug);
			expect(response.slug).toBe(slug);
		});

		it('returns null if the space was not found', async () => {
			const mockData: FindSpaceBySlugQuery = {
				maintainer_visitor_space: [],
			};
			mockDataService.execute.mockResolvedValueOnce(mockData);

			const space = await spacesService.findBySlug('unknown-id');
			expect(space).toBeNull();
		});
	});

	describe('findSpaceByCpUserId', () => {
		it('returns a single space', async () => {
			const mockData: FindSpaceBySlugQuery = {
				maintainer_visitor_space: [
					{
						id: '1',
					},
				] as FindSpaceBySlugQuery['maintainer_visitor_space'],
			};
			mockDataService.execute.mockResolvedValueOnce(mockData);
			const response = await spacesService.findSpaceByOrganisationId('1');
			expect(response.id).toBe('1');
		});

		it('returns null if the space was not found', async () => {
			const mockData: FindSpaceBySlugQuery = {
				maintainer_visitor_space: [],
			};
			mockDataService.execute.mockResolvedValueOnce(mockData);

			const space = await spacesService.findSpaceByOrganisationId('unknown-id');
			expect(space).toBeNull();
		});
	});

	describe('getMaintainerProfiles', () => {
		it('returns all profile ids for all maintainers of a VisitorSpace', async () => {
			const mockMaintainerIds: GetVisitorSpaceCpAdminProfilesQuery = {
				maintainer_visitor_space: [
					{
						profiles: [
							{
								id: '181c014f-365a-40ab-8694-1792768e57ee',
								mail: 'test.testers@meemoo.be',
								language: Locale.Nl,
							},
							{
								id: 'b6c5419f-6a19-4a41-a400-e0bbc0429c4f',
								mail: 'test.testers2@meemoo.be',
								language: Locale.Nl,
							},
							{
								id: 'df8024f9-ebdc-4f45-8390-72980a3f29f6',
								mail: 'test.testers3@meemoo.be',
								language: Locale.Nl,
							},
						],
					},
				],
			};
			mockDataService.execute.mockResolvedValueOnce(mockMaintainerIds);
			const response = await spacesService.getMaintainerProfiles('1');
			expect(response).toHaveLength(3);
			expect(response[0]).toEqual({
				id: mockMaintainerIds.maintainer_visitor_space[0].profiles[0].id,
				email: mockMaintainerIds.maintainer_visitor_space[0].profiles[0].mail,
				language: mockMaintainerIds.maintainer_visitor_space[0].profiles[0].language,
			});
		});
	});
});
