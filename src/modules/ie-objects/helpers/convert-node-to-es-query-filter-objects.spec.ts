import jsep from 'jsep';

import {
	esQuerySearchTemplate,
	mockConvertNodeToEsQueryFilterObject1,
	mockConvertNodeToEsQueryFilterObject2,
	mockConvertNodeToEsQueryFilterObject3,
	mockConvertNodeToEsQueryFilterObject4,
} from '../mocks/elasticsearch.mock';

import { IeObjectsSearchFilterField, Operator } from './../elasticsearch/elasticsearch.consts';
import { convertNodeToEsQueryFilterObjects } from './convert-node-to-es-query-filter-objects';

(jsep as any).removeAllBinaryOps();
(jsep as any).removeAllUnaryOps();

jsep.addBinaryOp('AND', 2);
jsep.addBinaryOp('OR', 1);

jsep.addUnaryOp('NOT');

describe('Convert node to es query filter objects', () => {
	it('Use case 1 - Bellewaerde', () => {
		const node = 'bellewaerde';

		const convertedNodesToEsQueryFilterObjects = convertNodeToEsQueryFilterObjects(
			jsep(node),
			{
				exact: esQuerySearchTemplate,
				fuzzy: esQuerySearchTemplate,
			},
			{
				field: IeObjectsSearchFilterField.QUERY,
				value: node,
				operator: Operator.CONTAINS,
			}
		);

		expect(convertedNodesToEsQueryFilterObjects).toEqual(mockConvertNodeToEsQueryFilterObject1);
	});

	it('Use case 2 - genetics AND ("dna sequencing" AND crispr AND (cloning OR genomics) AND NOT dna)', () => {
		const node = "genetics AND ('dna sequencing' AND crispr AND (cloning OR genomics) AND NOT dna)";

		const convertedNodesToEsQueryFilterObjects = convertNodeToEsQueryFilterObjects(
			jsep(node),
			{
				exact: esQuerySearchTemplate,
				fuzzy: esQuerySearchTemplate,
			},
			{
				field: IeObjectsSearchFilterField.QUERY,
				value: node,
				operator: Operator.CONTAINS,
			}
		);

		expect(convertedNodesToEsQueryFilterObjects).toEqual(mockConvertNodeToEsQueryFilterObject2);
	});

	it('Use case 3 - "Ineke van dam" test AND gent AND brussel AND NOT kortrijk', () => {
		const node = "'Ineke van dam' test AND gent AND brussel AND NOT kortrijk";

		const convertedNodesToEsQueryFilterObjects = convertNodeToEsQueryFilterObjects(
			jsep(node),
			{
				exact: esQuerySearchTemplate,
				fuzzy: esQuerySearchTemplate,
			},
			{
				field: IeObjectsSearchFilterField.QUERY,
				value: node,
				operator: Operator.CONTAINS,
			}
		);

		expect(convertedNodesToEsQueryFilterObjects).toEqual(mockConvertNodeToEsQueryFilterObject3);
	});

	it('Use case 4 - genetics test AND ("dna sequencing" test AND crispr AND (cloning OR genomics) AND NOT dna brecht tafel)', () => {
		const node =
			"genetics test AND ('dna sequencing' test AND crispr AND (cloning OR genomics) AND NOT dna brecht tafel)";

		const convertedNodesToEsQueryFilterObjects = convertNodeToEsQueryFilterObjects(
			jsep(node),
			{
				exact: esQuerySearchTemplate,
				fuzzy: esQuerySearchTemplate,
			},
			{
				field: IeObjectsSearchFilterField.QUERY,
				value: node,
				operator: Operator.CONTAINS,
			}
		);

		expect(convertedNodesToEsQueryFilterObjects).toEqual(mockConvertNodeToEsQueryFilterObject4);
	});
});
