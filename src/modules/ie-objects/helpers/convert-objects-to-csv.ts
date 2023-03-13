import { flatten } from 'flat';
import _ from 'lodash';
import Papa from 'papaparse';

import { IE_OBJECT_PROPS_METADATA_EXPORT } from '../ie-objects.conts';
import { IeObject } from '../ie-objects.types';

export const convertObjectsToCsv = (objects: Partial<IeObject>[]): string => {
	const csvData = objects.map((o) => _.pick(o, IE_OBJECT_PROPS_METADATA_EXPORT));
	return Papa.unparse([flatten(csvData)], { delimiter: ';' });
};

export const convertObjectToCsv = (object: Partial<IeObject>): string => {
	return Papa.unparse([flatten(_.pick(object, IE_OBJECT_PROPS_METADATA_EXPORT))], {
		delimiter: ';',
	});
};
