import { Locale } from '@meemoo/admin-core-api';

export interface SitemapItemInfo {
	loc: string;
	links: { href: string; hreflang: Locale }[];
	changefreq: string;
	lastmod?: string;
	priority?: number;
}

export interface SitemapConfig {
	value: SitemapPathInfo[];
	name: string;
	updated_at?: string;
	created_at?: string;
}

export interface SitemapPathInfo {
	path: string;
	priority?: number;
	blacklisted?: boolean;
}
