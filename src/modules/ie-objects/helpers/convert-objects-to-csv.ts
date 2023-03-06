import { flatten } from 'flat';
import Papa from 'papaparse';

import { IeObject } from '../ie-objects.types';

export const convertObjectsToCsv = (objects: Partial<IeObject>[]): string => {
	const csvData = objects.map(({ accessThrough, ...csvData }) => csvData);
	return Papa.unparse([flatten(csvData)], { delimiter: ';' });
};

export const convertObjectToCsv = (object: Partial<IeObject>): string => {
	const { accessThrough, ...csvData } = object;
	return Papa.unparse([flatten(csvData)], { delimiter: ';' });
};
