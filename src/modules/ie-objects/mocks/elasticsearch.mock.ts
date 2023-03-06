export const esQuerySearchTemplate = [
	{
		term: {
			premis_identifier: '{{query}}',
		},
	},
	{
		multi_match: {
			query: '{{query}}',
			type: 'phrase',
			slop: 5,
			boost: 100,
			fields: [
				'schema_name^20',
				'schema_description',
				'schema_abstract',
				'schema_is_part_of.alternatief^20',
				'schema_is_part_of.archief',
				'schema_is_part_of.deelarchief',
				'schema_is_part_of.deelreeks',
				'schema_is_part_of.programma',
				'schema_is_part_of.reeks',
				'schema_is_part_of.seizoen',
				'schema_is_part_of.serie',
				'schema_keywords',
				'schema_genre',
				'schema_transcript',
				'schema_captions',
				'schema_creator',
				'schema_spatial_coverage',
				'schema_temporal_coverage',
				'dcterms_medium',
			],
		},
	},
];

export const mockConvertNodeToEsQueryFilterObject1 = {
	bool: {
		should: [
			{
				term: {
					premis_identifier: 'bellewaerde',
				},
			},
			{
				multi_match: {
					query: 'bellewaerde',
					type: 'phrase',
					slop: 5,
					boost: 100,
					fields: [
						'schema_name^20',
						'schema_description',
						'schema_abstract',
						'schema_is_part_of.alternatief^20',
						'schema_is_part_of.archief',
						'schema_is_part_of.deelarchief',
						'schema_is_part_of.deelreeks',
						'schema_is_part_of.programma',
						'schema_is_part_of.reeks',
						'schema_is_part_of.seizoen',
						'schema_is_part_of.serie',
						'schema_keywords',
						'schema_genre',
						'schema_transcript',
						'schema_captions',
						'schema_creator',
						'schema_spatial_coverage',
						'schema_temporal_coverage',
						'dcterms_medium',
					],
				},
			},
		],
		minimum_should_match: 1,
	},
};

export const mockConvertNodeToEsQueryFilterObject2 = {
	bool: {
		should: [
			{
				bool: {
					should: [
						{
							term: {
								premis_identifier: 'genetics',
							},
						},
						{
							multi_match: {
								query: 'genetics',
								type: 'phrase',
								slop: 5,
								boost: 100,
								fields: [
									'schema_name^20',
									'schema_description',
									'schema_abstract',
									'schema_is_part_of.alternatief^20',
									'schema_is_part_of.archief',
									'schema_is_part_of.deelarchief',
									'schema_is_part_of.deelreeks',
									'schema_is_part_of.programma',
									'schema_is_part_of.reeks',
									'schema_is_part_of.seizoen',
									'schema_is_part_of.serie',
									'schema_keywords',
									'schema_genre',
									'schema_transcript',
									'schema_captions',
									'schema_creator',
									'schema_spatial_coverage',
									'schema_temporal_coverage',
									'dcterms_medium',
								],
							},
						},
					],
					minimum_should_match: 1,
				},
			},
			{
				bool: {
					should: [
						{
							bool: {
								should: [
									{
										bool: {
											should: [
												{
													bool: {
														should: [
															{
																term: {
																	premis_identifier:
																		'dna sequencing',
																},
															},
															{
																multi_match: {
																	query: 'dna sequencing',
																	type: 'phrase',
																	slop: 5,
																	boost: 100,
																	fields: [
																		'schema_name^20',
																		'schema_description',
																		'schema_abstract',
																		'schema_is_part_of.alternatief^20',
																		'schema_is_part_of.archief',
																		'schema_is_part_of.deelarchief',
																		'schema_is_part_of.deelreeks',
																		'schema_is_part_of.programma',
																		'schema_is_part_of.reeks',
																		'schema_is_part_of.seizoen',
																		'schema_is_part_of.serie',
																		'schema_keywords',
																		'schema_genre',
																		'schema_transcript',
																		'schema_captions',
																		'schema_creator',
																		'schema_spatial_coverage',
																		'schema_temporal_coverage',
																		'dcterms_medium',
																	],
																},
															},
														],
														minimum_should_match: 1,
													},
												},
												{
													bool: {
														should: [
															{
																term: {
																	premis_identifier: 'crispr',
																},
															},
															{
																multi_match: {
																	query: 'crispr',
																	type: 'phrase',
																	slop: 5,
																	boost: 100,
																	fields: [
																		'schema_name^20',
																		'schema_description',
																		'schema_abstract',
																		'schema_is_part_of.alternatief^20',
																		'schema_is_part_of.archief',
																		'schema_is_part_of.deelarchief',
																		'schema_is_part_of.deelreeks',
																		'schema_is_part_of.programma',
																		'schema_is_part_of.reeks',
																		'schema_is_part_of.seizoen',
																		'schema_is_part_of.serie',
																		'schema_keywords',
																		'schema_genre',
																		'schema_transcript',
																		'schema_captions',
																		'schema_creator',
																		'schema_spatial_coverage',
																		'schema_temporal_coverage',
																		'dcterms_medium',
																	],
																},
															},
														],
														minimum_should_match: 1,
													},
												},
											],
											minimum_should_match: 2,
										},
									},
									{
										bool: {
											should: [
												{
													bool: {
														should: [
															{
																term: {
																	premis_identifier: 'cloning',
																},
															},
															{
																multi_match: {
																	query: 'cloning',
																	type: 'phrase',
																	slop: 5,
																	boost: 100,
																	fields: [
																		'schema_name^20',
																		'schema_description',
																		'schema_abstract',
																		'schema_is_part_of.alternatief^20',
																		'schema_is_part_of.archief',
																		'schema_is_part_of.deelarchief',
																		'schema_is_part_of.deelreeks',
																		'schema_is_part_of.programma',
																		'schema_is_part_of.reeks',
																		'schema_is_part_of.seizoen',
																		'schema_is_part_of.serie',
																		'schema_keywords',
																		'schema_genre',
																		'schema_transcript',
																		'schema_captions',
																		'schema_creator',
																		'schema_spatial_coverage',
																		'schema_temporal_coverage',
																		'dcterms_medium',
																	],
																},
															},
														],
														minimum_should_match: 1,
													},
												},
												{
													bool: {
														should: [
															{
																term: {
																	premis_identifier: 'genomics',
																},
															},
															{
																multi_match: {
																	query: 'genomics',
																	type: 'phrase',
																	slop: 5,
																	boost: 100,
																	fields: [
																		'schema_name^20',
																		'schema_description',
																		'schema_abstract',
																		'schema_is_part_of.alternatief^20',
																		'schema_is_part_of.archief',
																		'schema_is_part_of.deelarchief',
																		'schema_is_part_of.deelreeks',
																		'schema_is_part_of.programma',
																		'schema_is_part_of.reeks',
																		'schema_is_part_of.seizoen',
																		'schema_is_part_of.serie',
																		'schema_keywords',
																		'schema_genre',
																		'schema_transcript',
																		'schema_captions',
																		'schema_creator',
																		'schema_spatial_coverage',
																		'schema_temporal_coverage',
																		'dcterms_medium',
																	],
																},
															},
														],
														minimum_should_match: 1,
													},
												},
											],
											minimum_should_match: 1,
										},
									},
								],
								minimum_should_match: 2,
							},
						},
						{
							bool: {
								must_not: {
									bool: {
										should: [
											{
												term: {
													premis_identifier: 'dna',
												},
											},
											{
												multi_match: {
													query: 'dna',
													type: 'phrase',
													slop: 5,
													boost: 100,
													fields: [
														'schema_name^20',
														'schema_description',
														'schema_abstract',
														'schema_is_part_of.alternatief^20',
														'schema_is_part_of.archief',
														'schema_is_part_of.deelarchief',
														'schema_is_part_of.deelreeks',
														'schema_is_part_of.programma',
														'schema_is_part_of.reeks',
														'schema_is_part_of.seizoen',
														'schema_is_part_of.serie',
														'schema_keywords',
														'schema_genre',
														'schema_transcript',
														'schema_captions',
														'schema_creator',
														'schema_spatial_coverage',
														'schema_temporal_coverage',
														'dcterms_medium',
													],
												},
											},
										],
										minimum_should_match: 1,
									},
								},
							},
						},
					],
					minimum_should_match: 2,
				},
			},
		],
		minimum_should_match: 2,
	},
};

export const mockConvertNodeToEsQueryFilterObject3 = {
	bool: {
		should: [
			{
				bool: {
					should: [
						{
							term: {
								premis_identifier: 'Ineke van dam',
							},
						},
						{
							multi_match: {
								query: 'Ineke van dam',
								type: 'phrase',
								slop: 5,
								boost: 100,
								fields: [
									'schema_name^20',
									'schema_description',
									'schema_abstract',
									'schema_is_part_of.alternatief^20',
									'schema_is_part_of.archief',
									'schema_is_part_of.deelarchief',
									'schema_is_part_of.deelreeks',
									'schema_is_part_of.programma',
									'schema_is_part_of.reeks',
									'schema_is_part_of.seizoen',
									'schema_is_part_of.serie',
									'schema_keywords',
									'schema_genre',
									'schema_transcript',
									'schema_captions',
									'schema_creator',
									'schema_spatial_coverage',
									'schema_temporal_coverage',
									'dcterms_medium',
								],
							},
						},
					],
					minimum_should_match: 1,
				},
			},
			{
				bool: {
					should: [
						{
							bool: {
								should: [
									{
										bool: {
											should: [
												{
													bool: {
														should: [
															{
																term: {
																	premis_identifier: 'test',
																},
															},
															{
																multi_match: {
																	query: 'test',
																	type: 'phrase',
																	slop: 5,
																	boost: 100,
																	fields: [
																		'schema_name^20',
																		'schema_description',
																		'schema_abstract',
																		'schema_is_part_of.alternatief^20',
																		'schema_is_part_of.archief',
																		'schema_is_part_of.deelarchief',
																		'schema_is_part_of.deelreeks',
																		'schema_is_part_of.programma',
																		'schema_is_part_of.reeks',
																		'schema_is_part_of.seizoen',
																		'schema_is_part_of.serie',
																		'schema_keywords',
																		'schema_genre',
																		'schema_transcript',
																		'schema_captions',
																		'schema_creator',
																		'schema_spatial_coverage',
																		'schema_temporal_coverage',
																		'dcterms_medium',
																	],
																},
															},
														],
														minimum_should_match: 1,
													},
												},
												{
													bool: {
														should: [
															{
																term: {
																	premis_identifier: 'gent',
																},
															},
															{
																multi_match: {
																	query: 'gent',
																	type: 'phrase',
																	slop: 5,
																	boost: 100,
																	fields: [
																		'schema_name^20',
																		'schema_description',
																		'schema_abstract',
																		'schema_is_part_of.alternatief^20',
																		'schema_is_part_of.archief',
																		'schema_is_part_of.deelarchief',
																		'schema_is_part_of.deelreeks',
																		'schema_is_part_of.programma',
																		'schema_is_part_of.reeks',
																		'schema_is_part_of.seizoen',
																		'schema_is_part_of.serie',
																		'schema_keywords',
																		'schema_genre',
																		'schema_transcript',
																		'schema_captions',
																		'schema_creator',
																		'schema_spatial_coverage',
																		'schema_temporal_coverage',
																		'dcterms_medium',
																	],
																},
															},
														],
														minimum_should_match: 1,
													},
												},
											],
											minimum_should_match: 2,
										},
									},
									{
										bool: {
											should: [
												{
													term: {
														premis_identifier: 'brussel',
													},
												},
												{
													multi_match: {
														query: 'brussel',
														type: 'phrase',
														slop: 5,
														boost: 100,
														fields: [
															'schema_name^20',
															'schema_description',
															'schema_abstract',
															'schema_is_part_of.alternatief^20',
															'schema_is_part_of.archief',
															'schema_is_part_of.deelarchief',
															'schema_is_part_of.deelreeks',
															'schema_is_part_of.programma',
															'schema_is_part_of.reeks',
															'schema_is_part_of.seizoen',
															'schema_is_part_of.serie',
															'schema_keywords',
															'schema_genre',
															'schema_transcript',
															'schema_captions',
															'schema_creator',
															'schema_spatial_coverage',
															'schema_temporal_coverage',
															'dcterms_medium',
														],
													},
												},
											],
											minimum_should_match: 1,
										},
									},
								],
								minimum_should_match: 2,
							},
						},
						{
							bool: {
								must_not: {
									bool: {
										should: [
											{
												term: {
													premis_identifier: 'kortrijk',
												},
											},
											{
												multi_match: {
													query: 'kortrijk',
													type: 'phrase',
													slop: 5,
													boost: 100,
													fields: [
														'schema_name^20',
														'schema_description',
														'schema_abstract',
														'schema_is_part_of.alternatief^20',
														'schema_is_part_of.archief',
														'schema_is_part_of.deelarchief',
														'schema_is_part_of.deelreeks',
														'schema_is_part_of.programma',
														'schema_is_part_of.reeks',
														'schema_is_part_of.seizoen',
														'schema_is_part_of.serie',
														'schema_keywords',
														'schema_genre',
														'schema_transcript',
														'schema_captions',
														'schema_creator',
														'schema_spatial_coverage',
														'schema_temporal_coverage',
														'dcterms_medium',
													],
												},
											},
										],
										minimum_should_match: 1,
									},
								},
							},
						},
					],
					minimum_should_match: 2,
				},
			},
		],
		minimum_should_match: 2,
	},
};

export const mockConvertNodeToEsQueryFilterObject4 = {
	bool: {
		should: [
			{
				bool: {
					should: [
						{
							term: {
								premis_identifier: 'genetics',
							},
						},
						{
							multi_match: {
								query: 'genetics',
								type: 'phrase',
								slop: 5,
								boost: 100,
								fields: [
									'schema_name^20',
									'schema_description',
									'schema_abstract',
									'schema_is_part_of.alternatief^20',
									'schema_is_part_of.archief',
									'schema_is_part_of.deelarchief',
									'schema_is_part_of.deelreeks',
									'schema_is_part_of.programma',
									'schema_is_part_of.reeks',
									'schema_is_part_of.seizoen',
									'schema_is_part_of.serie',
									'schema_keywords',
									'schema_genre',
									'schema_transcript',
									'schema_captions',
									'schema_creator',
									'schema_spatial_coverage',
									'schema_temporal_coverage',
									'dcterms_medium',
								],
							},
						},
					],
					minimum_should_match: 1,
				},
			},
			{
				bool: {
					should: [
						{
							bool: {
								should: [
									{
										term: {
											premis_identifier: 'test',
										},
									},
									{
										multi_match: {
											query: 'test',
											type: 'phrase',
											slop: 5,
											boost: 100,
											fields: [
												'schema_name^20',
												'schema_description',
												'schema_abstract',
												'schema_is_part_of.alternatief^20',
												'schema_is_part_of.archief',
												'schema_is_part_of.deelarchief',
												'schema_is_part_of.deelreeks',
												'schema_is_part_of.programma',
												'schema_is_part_of.reeks',
												'schema_is_part_of.seizoen',
												'schema_is_part_of.serie',
												'schema_keywords',
												'schema_genre',
												'schema_transcript',
												'schema_captions',
												'schema_creator',
												'schema_spatial_coverage',
												'schema_temporal_coverage',
												'dcterms_medium',
											],
										},
									},
								],
								minimum_should_match: 1,
							},
						},
						{
							bool: {
								should: [
									{
										bool: {
											should: [
												{
													term: {
														premis_identifier: 'dna sequencing',
													},
												},
												{
													multi_match: {
														query: 'dna sequencing',
														type: 'phrase',
														slop: 5,
														boost: 100,
														fields: [
															'schema_name^20',
															'schema_description',
															'schema_abstract',
															'schema_is_part_of.alternatief^20',
															'schema_is_part_of.archief',
															'schema_is_part_of.deelarchief',
															'schema_is_part_of.deelreeks',
															'schema_is_part_of.programma',
															'schema_is_part_of.reeks',
															'schema_is_part_of.seizoen',
															'schema_is_part_of.serie',
															'schema_keywords',
															'schema_genre',
															'schema_transcript',
															'schema_captions',
															'schema_creator',
															'schema_spatial_coverage',
															'schema_temporal_coverage',
															'dcterms_medium',
														],
													},
												},
											],
											minimum_should_match: 1,
										},
									},
									{
										bool: {
											should: [
												{
													bool: {
														should: [
															{
																bool: {
																	should: [
																		{
																			bool: {
																				should: [
																					{
																						term: {
																							premis_identifier:
																								'test',
																						},
																					},
																					{
																						multi_match:
																							{
																								query: 'test',
																								type: 'phrase',
																								slop: 5,
																								boost: 100,
																								fields: [
																									'schema_name^20',
																									'schema_description',
																									'schema_abstract',
																									'schema_is_part_of.alternatief^20',
																									'schema_is_part_of.archief',
																									'schema_is_part_of.deelarchief',
																									'schema_is_part_of.deelreeks',
																									'schema_is_part_of.programma',
																									'schema_is_part_of.reeks',
																									'schema_is_part_of.seizoen',
																									'schema_is_part_of.serie',
																									'schema_keywords',
																									'schema_genre',
																									'schema_transcript',
																									'schema_captions',
																									'schema_creator',
																									'schema_spatial_coverage',
																									'schema_temporal_coverage',
																									'dcterms_medium',
																								],
																							},
																					},
																				],
																				minimum_should_match: 1,
																			},
																		},
																		{
																			bool: {
																				should: [
																					{
																						term: {
																							premis_identifier:
																								'crispr',
																						},
																					},
																					{
																						multi_match:
																							{
																								query: 'crispr',
																								type: 'phrase',
																								slop: 5,
																								boost: 100,
																								fields: [
																									'schema_name^20',
																									'schema_description',
																									'schema_abstract',
																									'schema_is_part_of.alternatief^20',
																									'schema_is_part_of.archief',
																									'schema_is_part_of.deelarchief',
																									'schema_is_part_of.deelreeks',
																									'schema_is_part_of.programma',
																									'schema_is_part_of.reeks',
																									'schema_is_part_of.seizoen',
																									'schema_is_part_of.serie',
																									'schema_keywords',
																									'schema_genre',
																									'schema_transcript',
																									'schema_captions',
																									'schema_creator',
																									'schema_spatial_coverage',
																									'schema_temporal_coverage',
																									'dcterms_medium',
																								],
																							},
																					},
																				],
																				minimum_should_match: 1,
																			},
																		},
																	],
																	minimum_should_match: 2,
																},
															},
															{
																bool: {
																	should: [
																		{
																			bool: {
																				should: [
																					{
																						term: {
																							premis_identifier:
																								'cloning',
																						},
																					},
																					{
																						multi_match:
																							{
																								query: 'cloning',
																								type: 'phrase',
																								slop: 5,
																								boost: 100,
																								fields: [
																									'schema_name^20',
																									'schema_description',
																									'schema_abstract',
																									'schema_is_part_of.alternatief^20',
																									'schema_is_part_of.archief',
																									'schema_is_part_of.deelarchief',
																									'schema_is_part_of.deelreeks',
																									'schema_is_part_of.programma',
																									'schema_is_part_of.reeks',
																									'schema_is_part_of.seizoen',
																									'schema_is_part_of.serie',
																									'schema_keywords',
																									'schema_genre',
																									'schema_transcript',
																									'schema_captions',
																									'schema_creator',
																									'schema_spatial_coverage',
																									'schema_temporal_coverage',
																									'dcterms_medium',
																								],
																							},
																					},
																				],
																				minimum_should_match: 1,
																			},
																		},
																		{
																			bool: {
																				should: [
																					{
																						term: {
																							premis_identifier:
																								'genomics',
																						},
																					},
																					{
																						multi_match:
																							{
																								query: 'genomics',
																								type: 'phrase',
																								slop: 5,
																								boost: 100,
																								fields: [
																									'schema_name^20',
																									'schema_description',
																									'schema_abstract',
																									'schema_is_part_of.alternatief^20',
																									'schema_is_part_of.archief',
																									'schema_is_part_of.deelarchief',
																									'schema_is_part_of.deelreeks',
																									'schema_is_part_of.programma',
																									'schema_is_part_of.reeks',
																									'schema_is_part_of.seizoen',
																									'schema_is_part_of.serie',
																									'schema_keywords',
																									'schema_genre',
																									'schema_transcript',
																									'schema_captions',
																									'schema_creator',
																									'schema_spatial_coverage',
																									'schema_temporal_coverage',
																									'dcterms_medium',
																								],
																							},
																					},
																				],
																				minimum_should_match: 1,
																			},
																		},
																	],
																	minimum_should_match: 1,
																},
															},
														],
														minimum_should_match: 2,
													},
												},
												{
													bool: {
														must_not: {
															bool: {
																should: [
																	{
																		term: {
																			premis_identifier:
																				'dna',
																		},
																	},
																	{
																		multi_match: {
																			query: 'dna',
																			type: 'phrase',
																			slop: 5,
																			boost: 100,
																			fields: [
																				'schema_name^20',
																				'schema_description',
																				'schema_abstract',
																				'schema_is_part_of.alternatief^20',
																				'schema_is_part_of.archief',
																				'schema_is_part_of.deelarchief',
																				'schema_is_part_of.deelreeks',
																				'schema_is_part_of.programma',
																				'schema_is_part_of.reeks',
																				'schema_is_part_of.seizoen',
																				'schema_is_part_of.serie',
																				'schema_keywords',
																				'schema_genre',
																				'schema_transcript',
																				'schema_captions',
																				'schema_creator',
																				'schema_spatial_coverage',
																				'schema_temporal_coverage',
																				'dcterms_medium',
																			],
																		},
																	},
																],
																minimum_should_match: 1,
															},
														},
													},
												},
											],
											minimum_should_match: 2,
										},
									},
									{
										bool: {
											should: [
												{
													term: {
														premis_identifier: 'brecht',
													},
												},
												{
													multi_match: {
														query: 'brecht',
														type: 'phrase',
														slop: 5,
														boost: 100,
														fields: [
															'schema_name^20',
															'schema_description',
															'schema_abstract',
															'schema_is_part_of.alternatief^20',
															'schema_is_part_of.archief',
															'schema_is_part_of.deelarchief',
															'schema_is_part_of.deelreeks',
															'schema_is_part_of.programma',
															'schema_is_part_of.reeks',
															'schema_is_part_of.seizoen',
															'schema_is_part_of.serie',
															'schema_keywords',
															'schema_genre',
															'schema_transcript',
															'schema_captions',
															'schema_creator',
															'schema_spatial_coverage',
															'schema_temporal_coverage',
															'dcterms_medium',
														],
													},
												},
											],
											minimum_should_match: 1,
										},
									},
									{
										bool: {
											should: [
												{
													term: {
														premis_identifier: 'tafel',
													},
												},
												{
													multi_match: {
														query: 'tafel',
														type: 'phrase',
														slop: 5,
														boost: 100,
														fields: [
															'schema_name^20',
															'schema_description',
															'schema_abstract',
															'schema_is_part_of.alternatief^20',
															'schema_is_part_of.archief',
															'schema_is_part_of.deelarchief',
															'schema_is_part_of.deelreeks',
															'schema_is_part_of.programma',
															'schema_is_part_of.reeks',
															'schema_is_part_of.seizoen',
															'schema_is_part_of.serie',
															'schema_keywords',
															'schema_genre',
															'schema_transcript',
															'schema_captions',
															'schema_creator',
															'schema_spatial_coverage',
															'schema_temporal_coverage',
															'dcterms_medium',
														],
													},
												},
											],
											minimum_should_match: 1,
										},
									},
								],
								minimum_should_match: 0,
							},
						},
					],
					minimum_should_match: 2,
				},
			},
		],
		minimum_should_match: 2,
	},
};
