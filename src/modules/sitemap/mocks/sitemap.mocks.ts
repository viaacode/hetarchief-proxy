import { SitemapConfig } from '../sitemap.types';

export const mockSitemapConfig: SitemapConfig = {
	value: [
		{
			path: '/',
			priority: 1,
		},
		{
			path: '/bezoek',
			priority: 1,
		},
		{
			path: '/vragen',
			priority: 0.7,
		},
		{
			path: '/geheime-content-pagina',
			blacklisted: true,
		},
	],
	name: 'SITEMAP_CONFIG',
};
