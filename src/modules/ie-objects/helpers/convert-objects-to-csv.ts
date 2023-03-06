import papa from 'papaparse';

import { IeObject } from '../ie-objects.types';

export const convertObjectsToCsv = (objects: Partial<IeObject>[]): string => {
	return papa.unparse([{ objects }]);
};

export const convertObjectToCsv = (object: Partial<IeObject>): string => {
	return papa.unparse({ object });
};
