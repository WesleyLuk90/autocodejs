import minimist from 'minimist';
import { Scanner } from './Scanner';
import { Project } from './Project';
import { CommandParser } from './CommandParser';
import { ConsoleReader } from './ConsoleReader';
import { log } from './log';

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
				return scanner.watch().then(() => {
					const parser = new CommandParser(project);
					const reader = new ConsoleReader(parser);
					reader.start();
				});
			}
			return null;
		})
		.done();
}

main();
