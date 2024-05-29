function fail(reason = 'A test failed on purpose, no reason given') {
	throw new Error(reason);
}

global.fail = fail;
