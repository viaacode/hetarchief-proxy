import { find } from 'lodash';

import { IeObjectsQueryDto, SearchFilter } from '../dto/ie-objects.dto';

import { HetArchiefIeObjectType } from '@viaa/avo2-types';

export const checkAndFixFormatFilter = (queryDto: IeObjectsQueryDto | null): IeObjectsQueryDto => {
	const formatFilter = find(queryDto?.filters || [], { field: 'format' }) as SearchFilter;
	if (formatFilter?.value === HetArchiefIeObjectType.VIDEO) {
		// change to multivalue with video, film and video fragment
		formatFilter.multiValue = [
			HetArchiefIeObjectType.VIDEO,
			HetArchiefIeObjectType.FILM,
			HetArchiefIeObjectType.VIDEO_FRAGMENT,
		];
		formatFilter.value = undefined;
	} else if (formatFilter?.multiValue?.includes(HetArchiefIeObjectType.VIDEO)) {
		formatFilter.multiValue.push(HetArchiefIeObjectType.FILM);
		formatFilter.multiValue.push(HetArchiefIeObjectType.VIDEO_FRAGMENT);
	}
	if (formatFilter?.value === HetArchiefIeObjectType.AUDIO) {
		// change to multivalue with audio and audio fragment
		formatFilter.multiValue = [HetArchiefIeObjectType.AUDIO, HetArchiefIeObjectType.AUDIO_FRAGMENT];
		formatFilter.value = undefined;
	} else if (formatFilter?.multiValue?.includes(HetArchiefIeObjectType.AUDIO)) {
		formatFilter.multiValue.push(HetArchiefIeObjectType.AUDIO_FRAGMENT);
	}
	return queryDto;
};
