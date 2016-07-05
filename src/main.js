import minimist from 'minimist';
import { Scanner } from './Scanner';
import { Project } from './Project';
import { CommandParser } from './CommandParser';
import { ConsoleReader } from './ConsoleReader';
import { Server } from './Server';
import { log } from './log';

function parseArgs(args) {
	const options = {};
	const argv = minimist(args);

	options.projectPath = argv['project-path'];
	if (!options.projectPath) {
		console.log('--project-path must be provided');
		return false;
	}

	if (!argv.server && !argv.cli && !argv.action) {
		console.log('One of --server, --cli, --action must be provided');
		return false;
	}

	options.server = argv.server || false;
	options.cli = argv.cli || false;
	options.action = argv.action || false;

	options.port = argv.port || 62431;

	options.prettyPrint = argv['pretty-print'];

	return options;
}

function handleProject(project, options) {
	const scanner = new Scanner(project);
	const parser = new CommandParser(project, { prettyPrint: options.prettyPrint });
	if (options.cli) {
		return scanner.watch(true).then(() => {
			const reader = new ConsoleReader(parser);
			reader.start();
		});
	} else if (options.action) {
		return scanner.watch(false).then(() => {
			console.log(parser.parse(options.action));
		});
	} else if (options.server) {
		const server = new Server(options.port);
		server.start(options.port);
		log(`Starting server on port ${options.port}`);
	}
	return null;
}

function main() {
	const options = parseArgs(process.argv);
	if (!options) {
		return;
	}
	const project = new Project(options.projectPath);

	project
		.load()
		.then(() => handleProject(project, options))
		.catch(e => console.error(e.stack))
		.done();
}

main();
