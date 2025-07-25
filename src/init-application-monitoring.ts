// jira ticket: https://meemoo.atlassian.net/browse/ARC-2791
// dev docs: https://www.elastic.co/docs/reference/apm/agents/nodejs/express
// dashboard: http://do-prd-elk-01.do.viaa.be:5601/app/observability/overview
if (process.env.NODE_ENV !== 'local' && process.env.NODE_ENV !== 'test') {
	require('elastic-apm-node').start();
}
