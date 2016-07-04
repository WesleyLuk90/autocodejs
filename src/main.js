import minimist from 'minimist';
import { Scanner } from './Scanner';
import { Project } from './Project';
import { CommandParser } from './CommandParser';
import { Server } from './Server';

function parseArgs(args) {
	const options = {};
	const argv = minimist(args);

	options.projectPath = argv['project-path'];
	if (!options.projectPath) {
		console.log('--project-path must be provided');
		return false;
	}

	options.server = argv.server || false;

	options.port = argv.port || 62431;

	return options;
}

function main() {
	const options = parseArgs(process.argv);
	if (!options) {
		return;
	}
	const project = new Project(options.projectPath);

	project
		.load()
		.then(() => {
			const scanner = new Scanner(project);
			if (options.server) {
				scanner.watch();
				const parser = new CommandParser(project);
				const server = new Server(parser);
				server.start(options.port);
				return null;
			} else {
				return scanner.loadFiles();
			}
		})
		.done();
}

main();
