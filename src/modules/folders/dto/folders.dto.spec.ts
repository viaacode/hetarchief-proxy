import { describe, expect, it } from 'vitest';
import { CreateOrUpdateFolderDto, FolderObjectsQueryDto } from '~modules/folders/dto/folders.dto';

describe('FoldersDto', () => {
	describe('CreateOrUpdateFolderDto', () => {
		it('should be able to construct a CreateOrUpdateFolderDto object', async () => {
			const createOrUpdateFolderDto = new CreateOrUpdateFolderDto();
			expect(createOrUpdateFolderDto).toEqual({});
		});
	});
	describe('FolderObjectsQueryDto', () => {
		it('should be able to construct a FolderObjectsQueryDto object', async () => {
			const collectionObjectsQueryDto = new FolderObjectsQueryDto();
			expect(collectionObjectsQueryDto).toEqual({
				page: 1,
				query: undefined,
				size: 10,
			});
		});
	});
});
