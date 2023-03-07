import Papa from 'papaparse';
import { chain, fromPairs, map, toPairs } from 'ramda';

import { IeObject } from '../ie-objects.types';

export const convertObjectsToCsv = (objects: Partial<IeObject>[]): string => {
	const csvData = objects.map(({ accessThrough, ...csvData }) => csvData);
	return Papa.unparse([flattenObj(csvData)], { delimiter: ';' });
};

export const convertObjectToCsv = (object: Partial<IeObject>): string => {
	const { accessThrough, ...csvData } = object;
	return Papa.unparse([flattenObj(csvData)], { delimiter: ';' });
};

const flattenObj = (obj) => {
	const go = (objX): any =>
		chain(([k, v]: [string, any]) => {
			if (typeof v === 'object') {
				return map(([kX, vX]) => [`${k}.${kX}`, vX], go(v));
			} else {
				return [[k, v]];
			}
		}, toPairs(objX));
	return fromPairs(go(obj));
};
