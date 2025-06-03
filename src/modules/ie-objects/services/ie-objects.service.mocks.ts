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
