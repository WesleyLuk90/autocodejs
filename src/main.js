import minimist from 'minimist';
import { Scanner } from './Scanner';
import { Project } from './Project';
import { CommandParser } from './CommandParser';

function parseArgs(args) {
	const options = {};
	const argv = minimist(args);

	options.projectPath = argv['project-path'];
	if (!options.projectPath) {
		console.log('--project-path must be provided');
		return false;
	}

	options.server = argv.server || false;

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
				process.stdin.on('readable', () => {
					parser.parse(process.stdin.read());
				});
				return null;
			} else {
				return scanner.loadFiles();
			}
		})
		.done();
}

main();
