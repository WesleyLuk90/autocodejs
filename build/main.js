'use strict';

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _Scanner = require('./Scanner');

var _Project = require('./Project');

var _CommandParser = require('./CommandParser');

var _ConsoleReader = require('./ConsoleReader');

var _Server = require('./Server');

var _log = require('./log');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parseArgs(args) {
	var options = {};
	var argv = (0, _minimist2.default)(args);

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
	var scanner = new _Scanner.Scanner(project);
	var parser = new _CommandParser.CommandParser(project, { prettyPrint: options.prettyPrint });
	if (options.cli) {
		return scanner.watch(true).then(function () {
			var reader = new _ConsoleReader.ConsoleReader(parser);
			reader.start();
		});
	} else if (options.action) {
		return scanner.watch(false).then(function () {
			console.log(parser.parse(options.action));
		});
	} else if (options.server) {
		var server = new _Server.Server(options.port);
		server.start(options.port);
		(0, _log.log)('Starting server on port ' + options.port);
	}
	return null;
}

function main() {
	var options = parseArgs(process.argv);
	if (!options) {
		return;
	}
	var project = new _Project.Project(options.projectPath);

	project.load().then(function () {
		return handleProject(project, options);
	}).catch(function (e) {
		return console.error(e.stack);
	}).done();
}

main();