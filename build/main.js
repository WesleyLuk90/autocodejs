'use strict';

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _Scanner = require('./Scanner');

var _Project = require('./Project');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function main() {
	var argv = (0, _minimist2.default)(process.argv);

	var projectPath = argv['project-path'];
	if (!projectPath) {
		console.log('--project-path must be provided');
		return;
	}

	var project = new _Project.Project(projectPath);

	project.load().then(function () {
		var scanner = new _Scanner.Scanner(project);
		return scanner.getFiles();
	}).done();
}

main();