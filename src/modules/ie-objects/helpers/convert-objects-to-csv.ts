import { flatten } from 'flat';
import Papa from 'papaparse';

import { IeObject } from '../ie-objects.types';

export const convertObjectsToCsv = (objects: Partial<IeObject>[]): string => {
	return Papa.unparse([flatten(objects)], { delimiter: ';' });
};

export const convertObjectToCsv = (object: Partial<IeObject>): string => {
	const { accessThrough, ...csvData } = object;
	return Papa.unparse([flatten(csvData)], { delimiter: ';' });
};
