export interface SitemapItemInfo {
	loc: string;
	lastmod?: string;
	changefreq: string;
}

export interface SitemapItemConfig {
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
