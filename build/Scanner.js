'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Scanner = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _q = require('q');

var _q2 = _interopRequireDefault(_q);

var _FileBuilder = require('./FileBuilder');

var _chokidar = require('chokidar');

var _chokidar2 = _interopRequireDefault(_chokidar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Scanner = exports.Scanner = function () {
	function Scanner(project) {
		_classCallCheck(this, Scanner);

		this.project = project;
	}

	_createClass(Scanner, [{
		key: 'loadFiles',
		value: function loadFiles() {
			var _this = this;

			var options = {
				cwd: this.project.getProjectRoot()
			};
			return _q2.default.nfcall(_glob2.default, this.project.getGlobString(), options).then(function (files) {
				return _q2.default.all(files.map(function (path) {
					return _FileBuilder.FileBuilder.createFile(_this.project, path);
				}));
			}).then(function (files) {
				return _this.project.setFiles(files);
			});
		}
	}, {
		key: 'watch',
		value: function watch() {
			var _this2 = this;

			var options = { cwd: this.project.getProjectRoot() };
			this.watcher = _chokidar2.default.watch(this.project.getGlobString(), options);
			this.watcher.on('add', function (path) {
				_FileBuilder.FileBuilder.createFile(_this2.project, path).then(function (file) {
					return _this2.project.addFile(file);
				}).catch(function (e) {
					return console.error(e.stack);
				});
			});
			this.watcher.on('change', function (path) {
				_FileBuilder.FileBuilder.createFile(_this2.project, path).then(function (file) {
					return _this2.project.addFile(file);
				}).catch(function (e) {
					return console.error(e.stack);
				});
			});
			this.watcher.on('unlink', function (path) {
				_this2.project.removeFile(path);
			});
		}
	}]);

	return Scanner;
}();