import { describe, expect, it } from 'vitest';

import { getIeObjectNameSlug, IE_OBJECT_NAME_SLUG_FALLBACK } from './get-ie-object-name-slug';

describe('getIeObjectNameSlug', () => {
	it('kebab cases the title and strips accents', () => {
		expect(getIeObjectNameSlug('Vrij België')).toBe('vrij-belgie');
		expect(getIeObjectNameSlug("L'Écho de Belgique")).toBe('l-echo-de-belgique');
		expect(getIeObjectNameSlug('Vooruit: socialistisch dagblad')).toBe(
			'vooruit-socialistisch-dagblad'
		);
	});

	it('only keeps ascii letters, digits and dashes, the same as hetarchief-client', () => {
		expect(getIeObjectNameSlug('Heart ❤️ heart')).toBe('heart-heart');
		expect(getIeObjectNameSlug('Lukas Lelie gids Itali�reis')).toBe('lukas-lelie-gids-itali-reis');
		expect(getIeObjectNameSlug('Titel � ve meer')).toBe('titel-ve-meer');
		expect(getIeObjectNameSlug('東京 tokyo')).toBe('tokyo');
	});

	it('falls back to a placeholder for empty or unusable titles', () => {
		expect(getIeObjectNameSlug(null)).toBe(IE_OBJECT_NAME_SLUG_FALLBACK);
		expect(getIeObjectNameSlug('')).toBe(IE_OBJECT_NAME_SLUG_FALLBACK);
		expect(getIeObjectNameSlug('東京')).toBe(IE_OBJECT_NAME_SLUG_FALLBACK);
	});
});
