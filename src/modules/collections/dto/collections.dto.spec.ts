import {
	CollectionObjectsQueryDto,
	CreateOrUpdateCollectionDto,
} from '~modules/collections/dto/collections.dto';

describe('CollectionsDto', () => {
	describe('CreateOrUpdateCollectionDto', () => {
		it('should be able to construct a CreateOrUpdateCollectionDto object', async () => {
			const createOrUpdateCollectionDto = new CreateOrUpdateCollectionDto();
			expect(createOrUpdateCollectionDto).toEqual({});
		});
	});
	describe('CollectionObjectsQueryDto', () => {
		it('should be able to construct a CollectionObjectsQueryDto object', async () => {
			const collectionObjectsQueryDto = new CollectionObjectsQueryDto();
			expect(collectionObjectsQueryDto).toEqual({
				page: 1,
				query: undefined,
				size: 10,
			});
		});
	});
});
