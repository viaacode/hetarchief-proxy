import { flatten } from 'flat';
import Papa from 'papaparse';

import { IeObject } from '../ie-objects.types';

export const convertObjectsToCsv = (objects: Partial<IeObject>[]): string => {
	return Papa.unparse([flatten(objects)]);
};

export const convertObjectToCsv = (object: Partial<IeObject>): string => {
	return Papa.unparse([flatten(object)], { delimiter: ';' });
};
