import { find } from 'lodash';

import { IeObjectsQueryDto, SearchFilter } from '../dto/ie-objects.dto';
import { MediaFormat } from '../ie-objects.types';

export const checkAndFixFormatFilter = (queryDto: IeObjectsQueryDto): IeObjectsQueryDto => {
	const formatFilter = find(queryDto.filters, { field: 'format' }) as SearchFilter;
	if (formatFilter && formatFilter.value === MediaFormat.VIDEO) {
		// change to multivalue with video and film
		formatFilter.multiValue = ['video', 'film'];
		delete formatFilter.value;
	} else if (
		// multiValue case
		formatFilter &&
		formatFilter.multiValue &&
		formatFilter.multiValue.includes(MediaFormat.VIDEO)
	) {
		formatFilter.multiValue.push('film');
	}
	return queryDto;
};
