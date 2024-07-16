import { flatten } from 'flat';
import _ from 'lodash';
import Papa from 'papaparse';

import { IE_OBJECT_PROPS_METADATA_EXPORT } from '../ie-objects.conts';
import { type IeObject } from '../ie-objects.types';

/**
 * converts isPartOf object to isPartOf.serie, isPartOfProgramma, ...
 * @param ieObject
 */
function mapIeObjectForExport(ieObject: Partial<IeObject>): any {
	// Flatten isPartOf property
	const ieObjectCopy = _.pick(ieObject, IE_OBJECT_PROPS_METADATA_EXPORT);
	delete ieObjectCopy.isPartOf;
	return {
		...ieObjectCopy,
		...Object.fromEntries(
			Object.entries(ieObject.isPartOf || {}).map((isPartOfPair) => [
				`isPartOf.${isPartOfPair[0]}`,
				isPartOfPair[1],
			])
		),
	};
}

export const convertObjectsToCsv = (objects: Partial<IeObject>[]): string => {
	const csvData = objects.map(mapIeObjectForExport);
	return Papa.unparse([flatten(csvData)], { delimiter: ';', newline: '\n' });
};

export const convertObjectToCsv = (ieObject: Partial<IeObject>): string => {
	return Papa.unparse([flatten(mapIeObjectForExport(ieObject))], {
		delimiter: ';',
		newline: '\n',
	});
};
