export {}; // https://stackoverflow.com/questions/35758584/cannot-redeclare-block-scoped-variable-typescript
const fse: any = jest.createMockFromModule('fs-extra');

// This is a custom function that our tests can use during setup to specify
// what the files on the "mock" filesystem should look like when any of the
// `fse` APIs are used.
let mockFiles = Object.create(null);

function __setMockFiles(newMockFiles) {
	mockFiles = newMockFiles;
}

// A custom version of `readdirSync` that reads from the special mocked out
// file set via __setMockFiles
const readFileSync = (path: string): string | null => {
	let key = path;
	if (path.includes('proxy-whitelist.json')) {
		key = 'proxy-whitelist.json';
	} else if (path.includes('client-whitelist.json')) {
		key = 'client-whitelist.json';
	}

	return mockFiles[key] || null;
};

fse.__setMockFiles = __setMockFiles;
fse.existsSync = (): boolean => true;
fse.unlink = (): Promise<void> => Promise.resolve();
fse.readFileSync = readFileSync;

module.exports = fse;
