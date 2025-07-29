import { IeObjectRepresentation } from '~modules/ie-objects/ie-objects.types';

export const mockAutocompleteQueryResponseNewspaperSeries = {
	took: 20,
	timed_out: false,
	_shards: {
		total: 144,
		successful: 144,
		skipped: 0,
		failed: 0,
	},
	hits: {
		total: {
			value: 10000,
			relation: 'gte',
		},
		max_score: 18.348898,
		hits: [
			{
				_index: 'or-v97zq9j_2025-05-21t09.26.59',
				_id: '5717m04m87',
				_score: 18.348898,
				_source: {},
				fields: {
					'schema_is_part_of.newspaper.sayt': [
						'De volksbonder: orgaan van den Liberale Volksbond, Antwerpen',
					],
					'schema_is_part_of.newspaper.keyword': [
						'de volksbonder: orgaan van den liberale volksbond, antwerpen',
					],
				},
			},
			{
				_index: 'or-gh9b857_2025-05-21t09.26.59',
				_id: 'gq6qz23r23',
				_score: 10.901972,
				_source: {},
				fields: {
					'schema_is_part_of.newspaper.sayt': ['De volksstem: dagblad'],
					'schema_is_part_of.newspaper.keyword': ['de volksstem: dagblad'],
				},
			},
			{
				_index: 'or-0z70w1b_2025-05-21t09.26.59',
				_id: 'x921c1wd1w',
				_score: 10.569776,
				_source: {},
				fields: {
					'schema_is_part_of.newspaper.sayt': [
						'Ons volksonderwijs: orgaan van den Bond van Oud-Leerlingen der Stadsscholen van Gent',
					],
					'schema_is_part_of.newspaper.keyword': [
						'ons volksonderwijs: orgaan van den bond van oud-leerlingen der stadsscholen van gent',
					],
				},
			},
			{
				_index: 'or-0z70w1b_2025-05-21t09.26.59',
				_id: 'd21rf5pn9t',
				_score: 10.341086,
				_source: {},
				fields: {
					'schema_is_part_of.newspaper.sayt': [
						'Het katholiek onderwijs: orgaan der katholieke volksscholen van Vlaamsch België',
					],
					'schema_is_part_of.newspaper.keyword': [
						'het katholiek onderwijs: orgaan der katholieke volksscholen van vlaamsch belgië',
					],
				},
			},
		],
	},
};

export const mockAutocompleteQueryResponseCreators = {
	took: 2313,
	timed_out: false,
	_shards: {
		total: 121,
		successful: 121,
		skipped: 0,
		failed: 0,
	},
	hits: {
		total: {
			value: 22,
			relation: 'eq',
		},
		max_score: 3.5632455,
		hits: [
			{
				_index: 'or-g44hq0v_2025-05-19t14.23.28',
				_id: 'qs00000h0f',
				_score: 3.5632455,
				_source: {},
				fields: {
					'schema_creator_text.sayt': ['Dirk Van Mechelen'],
					'schema_creator_text.keyword': ['dirk van mechelen'],
				},
			},
			{
				_index: 'or-g44hq0v_2025-05-19t14.23.28',
				_id: 'qs3r0psc67',
				_score: 1.530849,
				_source: {},
				fields: {
					'schema_creator_text.sayt': [
						'Kabinet Dirk Van Mechelen, Vlaams minister van Financiën en Begroting en Ruimtelijk Ordening (2001-2009)',
					],
					'schema_creator_text.keyword': [
						'kabinet dirk van mechelen, vlaams minister van financiën en begroting en ruimtelijk ordening (2001-2009)',
					],
				},
			},
		],
	},
};

const representationMp3: IeObjectRepresentation = {
	id: 'https://data.hetarchief.be/id/entity/41ed99a7cab4918da5536322c05a9162',
	schemaName:
		"Lageresolutiekopie (mp3): 'Interview met leerlingen van de Europaklassen (week 69)  4-10 februari 1996\n\tschool Anderlecht' (mg7fr16t33)",
	isMediaFragmentOf: null,
	schemaInLanguage: null,
	schemaStartTime: null,
	schemaEndTime: null,
	schemaTranscriptUrl: null,
	edmIsNextInSequence: null,
	updatedAt: '2025-06-23T07:10:44.031597+00:00',
	files: [
		{
			id: 'https://data.hetarchief.be/id/entity/4236d6a49512a8787d8ff1425dace297',
			name: 'browse.mp3',
			mimeType: 'audio/mpeg',
			storedAt:
				'https://media.viaa.be/play/v2/DEPARTEMENTCULTUURJEUGDENMEDIA/b0058557856c4b10b3bebfa7340d59e7034e2993588f4a11a79cb3861c3d7868/browse.mp3',
			duration: 5667.08,
			edmIsNextInSequence: null,
			createdAt: '2025-06-23T07:10:47.175853+00:00',
		},
		{
			id: 'https://data.hetarchief.be/id/entity/a57f867f107a4734b183198390974205',
			name: 'peak.json',
			mimeType: 'application/json',
			storedAt:
				'https://media.viaa.be/play/v2/DEPARTEMENTCULTUURJEUGDENMEDIA/b0058557856c4b10b3bebfa7340d59e7034e2993588f4a11a79cb3861c3d7868/peak.json',
			duration: null,
			edmIsNextInSequence: null,
			createdAt: '2025-06-23T07:26:28.249917+00:00',
		},
	],
};
const representationMp4: IeObjectRepresentation = {
	id: 'https://data.hetarchief.be/id/entity/b510a045a192e5cfda4738dd129af99d',
	schemaName:
		"Lageresolutiekopie (mp4): 'Interview met leerlingen van de Europaklassen (week 69)  4-10 februari 1996\n\tschool Anderlecht' (mg7fr16t33)",
	isMediaFragmentOf: null,
	schemaInLanguage: null,
	schemaStartTime: null,
	schemaEndTime: null,
	schemaTranscriptUrl: null,
	edmIsNextInSequence: null,
	updatedAt: '2025-06-23T07:28:33.301476+00:00',
	files: [
		{
			id: 'https://data.hetarchief.be/id/entity/e5cad209c5bcddff3e884804825b6e7b',
			name: 'browse.mp4',
			mimeType: 'audio/mp4',
			storedAt:
				'https://media.viaa.be/play/v2/DEPARTEMENTCULTUURJEUGDENMEDIA/b0058557856c4b10b3bebfa7340d59e7034e2993588f4a11a79cb3861c3d7868/browse.mp4',
			thumbnailUrl:
				'https://media.viaa.be/play/v2/DEPARTEMENTCULTUURJEUGDENMEDIA/b0058557856c4b10b3bebfa7340d59e7034e2993588f4a11a79cb3861c3d7868/keyframes-thumb/keyframes_1_1/keyframe1.jpg?token=eyJraWQiOiIwMDAyIiwiYWxnIjoiSFMyNTYifQ.eyJhdWQiOiJoZXRhcmNoaWVmLmJlIiwiZXhwIjoxNzUzODA5MzQ1LCJzdWIiOiJERVBBUlRFTUVOVENVTFRVVVJKRVVHREVOTUVESUEvYjAwNTg1NTc4NTZjNGIxMGIzYmViZmE3MzQwZDU5ZTcwMzRlMjk5MzU4OGY0YTExYTc5Y2IzODYxYzNkNzg2OC9rZXlmcmFtZXMtdGh1bWIva2V5ZnJhbWVzXzFfMS9rZXlmcmFtZTEuanBnIiwiaXAiOiI6OmZmZmY6MTcyLjE3LjE0LjE2IiwicmVmZXJlciI6Imh0dHBzOi8vdjMuaGV0YXJjaGllZi5iZSIsImZyYWdtZW50IjpbXX0.GRkCMThsDU-Wv4SF2AWmEHIHMT9fN5xWwH5rjwJW9Io',
			duration: 5667.08,
			edmIsNextInSequence: null,
			createdAt: '2025-06-23T07:36:16.188475+00:00',
		},
		{
			id: 'https://data.hetarchief.be/id/entity/a57f867f107a4734b183198390974205',
			name: 'peak.json',
			mimeType: 'application/json',
			storedAt:
				'https://media.viaa.be/play/v2/DEPARTEMENTCULTUURJEUGDENMEDIA/b0058557856c4b10b3bebfa7340d59e7034e2993588f4a11a79cb3861c3d7868/peak.json',
			duration: null,
			edmIsNextInSequence: null,
			createdAt: '2025-06-23T07:26:28.249917+00:00',
		},
	],
};
const representationMa4: IeObjectRepresentation = {
	id: 'https://data.hetarchief.be/id/entity/dc83542dfbfa88127b3107600349d045',
	schemaName:
		"Lageresolutiekopie (m4a): 'Interview met leerlingen van de Europaklassen (week 69)  4-10 februari 1996\n\tschool Anderlecht' (mg7fr16t33)",
	isMediaFragmentOf: null,
	schemaInLanguage: null,
	schemaStartTime: null,
	schemaEndTime: null,
	schemaTranscriptUrl: null,
	edmIsNextInSequence: null,
	updatedAt: '2025-06-23T07:34:47.956169+00:00',
	files: [
		{
			id: 'https://data.hetarchief.be/id/entity/53db6fbda94c45b7dd0af42fa91e19d6',
			name: 'browse.m4a',
			mimeType: 'audio/m4a',
			storedAt:
				'https://media.viaa.be/play/v2/DEPARTEMENTCULTUURJEUGDENMEDIA/b0058557856c4b10b3bebfa7340d59e7034e2993588f4a11a79cb3861c3d7868/browse.m4a',
			duration: 5667.08,
			edmIsNextInSequence: null,
			createdAt: '2025-06-23T07:13:32.147052+00:00',
		},
		{
			id: 'https://data.hetarchief.be/id/entity/a57f867f107a4734b183198390974205',
			name: 'peak.json',
			mimeType: 'application/json',
			storedAt:
				'https://media.viaa.be/play/v2/DEPARTEMENTCULTUURJEUGDENMEDIA/b0058557856c4b10b3bebfa7340d59e7034e2993588f4a11a79cb3861c3d7868/peak.json',
			duration: null,
			edmIsNextInSequence: null,
			createdAt: '2025-06-23T07:26:28.249917+00:00',
		},
	],
};
export const representationsNewspaper: IeObjectRepresentation[] = [
	{
		id: 'https://data.hetarchief.be/id/entity/26420d7bcb57fa9bad812876bb2fa44c/b565a828249953ec74bae4d396849891',
		schemaName: "IIIF kopie (jp2): 'La Libre Belgique' (26420d7bcb57fa9bad812876bb2fa44c)",
		isMediaFragmentOf: null,
		schemaInLanguage: null,
		schemaStartTime: null,
		schemaEndTime: null,
		schemaTranscriptUrl: null,
		edmIsNextInSequence: null,
		updatedAt: '2025-06-23T07:06:11.271076+00:00',
		files: [
			{
				id: 'https://data.hetarchief.be/id/entity/26420d7bcb57fa9bad812876bb2fa44c/2f1201c076bcede9f55f79b572a3bc03',
				name: '0f55807d1f27470daedf39861ee3c409e641b10d559e408c8c53b18b0461aaef697a80a885b04f88a15a5f8d0a967fa5.jp2',
				mimeType: 'image/jp2',
				storedAt:
					'https://iiif.meemoo.be/image/3/hetarchief%252FOR-kw57h48%252F0f%252F0f55807d1f27470daedf39861ee3c409e641b10d559e408c8c53b18b0461aaef697a80a885b04f88a15a5f8d0a967fa5.jp2',
				duration: null,
				edmIsNextInSequence: null,
				createdAt: '2025-06-23T07:06:11.424502+00:00',
			},
		],
	},
	{
		id: 'https://data.hetarchief.be/id/entity/c00286fbc2f1209659e70cf508620569',
		schemaName: "Lageresolutiekopie (jpg): 'La Libre Belgique' (8p5v698x44)",
		isMediaFragmentOf: null,
		schemaInLanguage: null,
		schemaStartTime: null,
		schemaEndTime: null,
		schemaTranscriptUrl: null,
		edmIsNextInSequence: null,
		updatedAt: '2025-06-23T07:30:24.376609+00:00',
		files: [
			{
				id: 'https://data.hetarchief.be/id/entity/5787a7741ad5743244a79f5a3e4f876d',
				name: 'browse.jpg',
				mimeType: 'image/jpeg',
				storedAt:
					'https://media.viaa.be/play/v2/LETTERENHUIS/0f55807d1f27470daedf39861ee3c409e641b10d559e408c8c53b18b0461aaef/browse.jpg',
				thumbnailUrl:
					'https://media.viaa.be/play/v2/LETTERENHUIS/0f55807d1f27470daedf39861ee3c409e641b10d559e408c8c53b18b0461aaef/browse-thumb.jpg?token=eyJraWQiOiIwMDAyIiwiYWxnIjoiSFMyNTYifQ.eyJhdWQiOiJoZXRhcmNoaWVmLmJlIiwiZXhwIjoxNzUzODEwNTQ1LCJzdWIiOiJMRVRURVJFTkhVSVMvMGY1NTgwN2QxZjI3NDcwZGFlZGYzOTg2MWVlM2M0MDllNjQxYjEwZDU1OWU0MDhjOGM1M2IxOGIwNDYxYWFlZi9icm93c2UtdGh1bWIuanBnIiwiaXAiOiI6OmZmZmY6MTcyLjE3LjUzLjU5IiwicmVmZXJlciI6Imh0dHBzOi8vdjMuaGV0YXJjaGllZi5iZSIsImZyYWdtZW50IjpbXX0.-EdDjLvOdZDa18-4NS3WUXS2iD-YZef20oJuzVDjQt0',
				duration: null,
				edmIsNextInSequence: null,
				createdAt: '2025-06-23T07:14:05.614178+00:00',
			},
		],
	},
	{
		id: 'https://data.hetarchief.be/id/entity/faf96630b357f09db896c8d1a67bc865',
		schemaName:
			"Digitale representatie (alto): '8p5v698x44_19181112_0001_alto.xml' (26420d7bcb57fa9bad812876bb2fa44c)",
		isMediaFragmentOf: null,
		schemaInLanguage: null,
		schemaStartTime: null,
		schemaEndTime: null,
		schemaTranscript:
			"LA LIBRE BELGIQUE J'-v,foi dans nos destinées;\" tm Pays qui se détend s'Impose au Envers les'per6onnes qui dominent par la force militaire notre respect de tous ce pays ne périt pas! Dieu sera avec nous DAMnco pays, ayons les égards que commande l'intérêt générai Res- dans celte cause juste. FONDtE psetons les règlements qu'elles nous imposent aussi longtemps ALBERT, Roi ofs Bel,oes (4 août 1914). péxroipd 101^ qu'ils ne-portent atteinte ni à la liberte de nos consciences Acceptons provisoirement les sacrifices qui nous sont imposé?... ^ rbVKltK 1915 -chrétiennes ni à notrfe Dignité Patriotique. et attendons patiemment l'heure de la réparation A. MAX* Mgr MERCIER- BULLETIN DE PROPAGANDE PATRIOTIQUE - RÉGULIÈREMENT IRREGULIER NE SE SOUMETTANT A AUCUNE CENSURE a ADRESSE TÉLÉGRAPHIQUE KOMMANDANTUR - BRUXELLES BUREAUX ET ADMINISTRATION ne pouvant être un emplacement de tout repos, ils sont installés dans une cavè automobile AINNUNLtib Les altaires étant m. sous la domination allemande,„nous av. supprimé la page d'annonces et con seillons à nos clients de réserver k ' argent pour des temps meilleurs. N° 171 et dernier NUMERO 10 CENTIMES 12 Novembre 1918 PRiX DU NUA1ERO — L'astique, ae zéro a l'infini (prière aux revendeurs de ne pas dépasser cette Ihiiltej",
		schemaTranscriptUrl:
			'http://swarmget.do.viaa.be/alto/a22094fa0a494a4b932a33d233ecad588da595dec3144bfbb9d1104102ef8d1b.xml.json?domain=s3.viaa.be',
		edmIsNextInSequence: null,
		updatedAt: '2025-06-23T07:39:13.913201+00:00',
		files: [
			{
				id: 'https://data.hetarchief.be/id/entity/88a85bbb95b56ed0f5ee026d180bb15c',
				name: '8p5v698x44_19181112_0001_alto.xml',
				mimeType: 'application/xml',
				storedAt:
					'https://media.viaa.be/play/v2/MOB/LETTERENHUIS/a22094fa0a494a4b932a33d233ecad588da595dec3144bfbb9d1104102ef8d1b/a22094fa0a494a4b932a33d233ecad588da595dec3144bfbb9d1104102ef8d1b.xml',
				duration: null,
				edmIsNextInSequence: null,
				createdAt: '2025-06-23T07:21:49.762545+00:00',
			},
		],
	},
];
export const cleanupRepresentations1 = [representationMp3, representationMp4, representationMa4];
export const cleanupRepresentations2 = [representationMp4, representationMa4];
export const cleanupRepresentations3 = [representationMp3, representationMa4];
export const cleanupRepresentations4 = [representationMp3, representationMp4];
export const cleanupRepresentations5 = [representationMp4];
