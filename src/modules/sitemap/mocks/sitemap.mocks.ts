import { DbContentPage } from '@meemoo/admin-core-api';

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

export const mockContentPage: DbContentPage = {
	id: '3be90381-2a80-4c0e-8f30-d618ab6e2d77',
	thumbnailPath: null,
	title: 'mock content page',
	description: '<p></p>',
	seoDescription: null,
	metaDescription: null,
	path: '/mock-content-page-url',
	isPublic: false,
	publishedAt: null,
	publishAt: null,
	depublishAt: null,
	createdAt: '2023-04-18T09:51:27.509',
	updatedAt: '2023-04-18T09:54:16.675',
	isProtected: false,
	contentType: 'PAGINA',
	contentWidth: 'MEDIUM',
	owner: {
		id: undefined,
		fullName: 'meemoo Admin',
		firstName: 'meemoo',
		lastName: 'Admin',
		groupId: '0b281484-76cd-45a9-b6ce-68a0ea7f4b26',
		groupName: 'Sitebeheerder',
	},
	userProfileId: 'c4dead9b-32c3-4459-a66b-23f73afba3ea',
	userGroupIds: [],
	content_blocks: [],
	labels: [],
};

export const mockSitemapSpaces = {
	items: [
		{
			id: '1',
			name: 'Space Mountain',
			image: 'http://assets-int.hetarchief.be/hetarchief/SPACE_IMAGE/image.jpg',
			maintainerId: 'OR-rf5kf25',
		},
		{
			id: '2',
			name: 'Space X',
			maintainerId: 'OR-spacex',
		},
	],
};

export const mockGeneralXml =
	'<?xml version="1.0" encoding="UTF-8"?>\n\t\t<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n\t\t\t<url>\n\t\t\t<loc>http://bezoekerstool/</loc>\n\t\t\t\n\t\t\t<changefreq>monthly</changefreq>\n\t\t\t<priority>1</priority>\n\t\t\t</url>\n<url>\n\t\t\t<loc>http://bezoekerstool/bezoek</loc>\n\t\t\t\n\t\t\t<changefreq>monthly</changefreq>\n\t\t\t<priority>1</priority>\n\t\t\t</url>\n<url>\n\t\t\t<loc>http://bezoekerstool/zoeken</loc>\n\t\t\t\n\t\t\t<changefreq>monthly</changefreq>\n\t\t\t\n\t\t\t</url>\n<url>\n\t\t\t<loc>http://bezoekerstool/mock-content-page-url</loc>\n\t\t\t\n\t\t\t<changefreq>monthly</changefreq>\n\t\t\t\n\t\t\t</url>\n<url>\n\t\t\t<loc>http://bezoekerstool/zoeken/?aanbieders=OR-rf5kf25</loc>\n\t\t\t\n\t\t\t<changefreq>weekly</changefreq>\n\t\t\t\n\t\t\t</url>\n<url>\n\t\t\t<loc>http://bezoekerstool/zoeken/?aanbieders=OR-spacex</loc>\n\t\t\t\n\t\t\t<changefreq>weekly</changefreq>\n\t\t\t\n\t\t\t</url>\n\t\t</urlset>\n\t\t';
