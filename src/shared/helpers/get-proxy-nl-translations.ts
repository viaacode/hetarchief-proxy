import fs from 'node:fs/promises';

export enum Component {
	ADMIN_CORE = 'ADMIN_CORE',
	FRONTEND = 'FRONTEND',
	BACKEND = 'BACKEND',
}

export type Location = string;
export type Key = string;

export enum ValueType {
	TEXT = 'TEXT',
	HTML = 'HTML',
}

export enum Locale {
	Nl = 'nl',
	En = 'en',
}

const SITE_TRANSLATIONS: Record<string, string> | null = null;

/**
 * Fetches the translations from the src/shared/i18n/locales/nl.json file
 * Also caches the translations so they don't have to be fetched from disk again within the same test
 */
export async function getProxyNlTranslations(): Promise<Record<string, string>> {
	if (SITE_TRANSLATIONS) {
		return SITE_TRANSLATIONS;
	}
	return JSON.parse(await fs.readFile('src/shared/i18n/locales/nl.json', 'utf-8'));
}
