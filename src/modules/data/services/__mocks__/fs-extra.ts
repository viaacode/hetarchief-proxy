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

const readFile = async (path: string): Promise<string | null> => {
	if (path.includes('404.html')) {
		return `
<html lang="nl" style="--vh:12.89px;">
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width">
		<meta name="next-head-count" content="2">
		<title>bezoekertool</title>
	</head>
	<body style="position: relative; top: 0;">
		<a href="{{CLIENT_HOST}}/">Start je bezoek</a>
	</body>
</html>`;
	}
	throw new Error('Trying to read unmocked file using ("fs-extra").readFile()');
};

fse.__setMockFiles = __setMockFiles;
fse.existsSync = (): boolean => true;
fse.unlink = (): Promise<void> => Promise.resolve();
fse.readFileSync = readFileSync;
fse.readFile = readFile;

module.exports = fse;
