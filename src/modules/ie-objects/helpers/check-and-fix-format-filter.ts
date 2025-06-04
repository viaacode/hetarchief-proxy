import { find } from 'lodash';

import type { IeObjectsQueryDto, SearchFilter } from '../dto/ie-objects.dto';

import { IeObjectType } from '~modules/ie-objects/ie-objects.types';

export const checkAndFixFormatFilter = (queryDto: IeObjectsQueryDto | null): IeObjectsQueryDto => {
	const formatFilter = find(queryDto?.filters || [], { field: 'format' }) as SearchFilter;
	if (formatFilter?.value === IeObjectType.VIDEO) {
		// change to multivalue with video, film and video fragment
		formatFilter.multiValue = [IeObjectType.VIDEO, IeObjectType.FILM, IeObjectType.VIDEO_FRAGMENT];
		formatFilter.value = undefined;
	} else if (formatFilter?.multiValue?.includes(IeObjectType.VIDEO)) {
		formatFilter.multiValue.push(IeObjectType.FILM);
		formatFilter.multiValue.push(IeObjectType.VIDEO_FRAGMENT);
	}
	if (formatFilter?.value === IeObjectType.AUDIO) {
		// change to multivalue with audio and audio fragment
		formatFilter.multiValue = [IeObjectType.AUDIO, IeObjectType.AUDIO_FRAGMENT];
		formatFilter.value = undefined;
	} else if (formatFilter?.multiValue?.includes(IeObjectType.AUDIO)) {
		formatFilter.multiValue.push(IeObjectType.AUDIO_FRAGMENT);
	}
	return queryDto;
};
