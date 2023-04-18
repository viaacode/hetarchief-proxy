export interface SitemapItemInfo {
	loc: string;
	changefreq: string;
	lastmod?: string;
	priority?: number;
}

export interface SitemapConfig {
	value: PathInfo[];
	name: string;
	updated_at?: string;
	created_at?: string;
}

export interface PathInfo {
	path: string;
	priority?: number;
	blacklisted?: boolean;
}
