import { IeObjectSector } from '~modules/ie-objects/ie-objects.types';

/**
 * Sometimes the sector doesn't have the expected case. eg: Publieke Omroep vs Publieke omroep
 * @param sector
 */
export function normalizeSector(sector: string | undefined | null): IeObjectSector | null {
	if (!sector) {
		console.error('Sector is undefined');
		return null;
	}
	const index = Object.values(IeObjectSector)
		.map((value) => value.toLowerCase())
		.indexOf(sector.toLowerCase());
	if (index === -1) {
		console.error(`Failed to find valid sector for value: ${sector}`);
		return null;
	}
	return Object.values(IeObjectSector)[index] as IeObjectSector;
}
