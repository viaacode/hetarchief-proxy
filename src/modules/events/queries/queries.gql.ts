export const INSERT_EVENTS = `
	mutation insertEventLogEntry($eventLogEntries: [hetarchief_events_v2_insert_input!]!) {
		insert_hetarchief_events_v2(objects: $eventLogEntries) {
			affected_rows
		}
	}
`;
