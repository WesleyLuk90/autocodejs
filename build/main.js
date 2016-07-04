'use strict';

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _Scanner = require('./Scanner');

var _Project = require('./Project');

var _CommandParser = require('./CommandParser');

var _Server = require('./Server');

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
			scanner.watch();
			var parser = new _CommandParser.CommandParser(project);
			var server = new _Server.Server(parser);
			server.start(options.port);
			return null;
		} else {
			return scanner.loadFiles();
		}
	}).done();
}

main();