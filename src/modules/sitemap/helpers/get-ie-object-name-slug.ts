import { kebabCase } from 'lodash';

/** Used as the name part of a detail page url when an ie-object has no usable name */
export const IE_OBJECT_NAME_SLUG_FALLBACK = 'titel';

/**
 * Converts an ie-object title into the slug that forms the last part of its detail page url.
 * Only plain ascii letters, digits and dashes are kept: kebabCase leaves emoji, non latin scripts and
 * the replacement character (�) of badly encoded titles in place. Those end up percent encoded
 * in the sitemap and don't match the canonical url of the client, so search engines hit a redirect.
 *
 * Keep this in sync with getIeObjectNameSlug in hetarchief-client (src/modules/shared/helpers/ie-object-urls.ts)
 * https://meemoo.atlassian.net/browse/ARC-3363
 */
export function getIeObjectNameSlug(name: string | null | undefined): string {
	return (
		kebabCase(name || '')
			.replace(/[^a-z0-9-]+/g, '-')
			.replace(/-{2,}/g, '-')
			.replace(/^-|-$/g, '') || IE_OBJECT_NAME_SLUG_FALLBACK
	);
}
