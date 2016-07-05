'use strict';

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _Scanner = require('./Scanner');

var _Project = require('./Project');

var _CommandParser = require('./CommandParser');

var _ConsoleReader = require('./ConsoleReader');

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

	options.server = argv.server || false;

	options.port = argv.port || 62431;

	return options;
}

function main() {
	var options = parseArgs(process.argv);
	if (!options) {
		return;
	}
	var project = new _Project.Project(options.projectPath);

	project.load().then(function () {
		var scanner = new _Scanner.Scanner(project);
		if (options.server) {
			return scanner.watch().then(function () {
				var parser = new _CommandParser.CommandParser(project);
				var reader = new _ConsoleReader.ConsoleReader(parser);
				reader.start();
			});
		}
		return null;
	}).done();
}

main();