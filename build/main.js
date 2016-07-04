'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _Scanner = require('./Scanner');

var _Project = require('./Project');

var _CommandParser = require('./CommandParser');

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
			var _ret = function () {
				scanner.watch();
				var parser = new _CommandParser.CommandParser(project);
				process.stdin.on('readable', function () {
					parser.parse(process.stdin.read());
				});
				return {
					v: null
				};
			}();

			if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
		} else {
			return scanner.loadFiles();
		}
	}).done();
}

main();