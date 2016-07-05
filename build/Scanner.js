'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Scanner = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _FileBuilder = require('./FileBuilder');

var _chokidar = require('chokidar');

var _chokidar2 = _interopRequireDefault(_chokidar);

var _q = require('q');

var _q2 = _interopRequireDefault(_q);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Scanner = exports.Scanner = function () {
	function Scanner(project) {
		_classCallCheck(this, Scanner);

		this.project = project;
	}

	_createClass(Scanner, [{
		key: 'updateFile',
		value: function updateFile(path) {
			var _this = this;

			return _FileBuilder.FileBuilder.createFile(this.project, path).then(function (file) {
				return _this.project.addFile(file);
			}).catch(function (e) {
				return console.error(e.stack);
			});
		}
	}, {
		key: 'removeFile',
		value: function removeFile(path) {
			this.project.removeFile(path);
		}
	}, {
		key: 'addNodeModule',
		value: function addNodeModule(path) {
			this.project.addNodeModule(this.getModuleName(path));
		}
	}, {
		key: 'removeNodeModule',
		value: function removeNodeModule(path) {
			this.project.removeNodeModule(this.getModuleName(path));
		}
	}, {
		key: 'getModuleName',
		value: function getModuleName(path) {
			return path.replace(/.*[\/\\]([^\/\\]+)/, '$1');
		}
	}, {
		key: 'watch',
		value: function watch() {
			return _q2.default.all([this.watchFiles(), this.watchModules()]);
		}
	}, {
		key: 'watchModules',
		value: function watchModules() {
			var _this2 = this;

			var modulesOptions = {
				cwd: this.project.getProjectRoot(),
				ignored: /node_modules\/.*\/.*/
			};
			this.modulesWatcher = _chokidar2.default.watch('node_modules/*', modulesOptions);
			this.modulesWatcher.on('addDir', function (path) {
				return _this2.addNodeModule(path);
			});
			this.modulesWatcher.on('unlinkDir', function (path) {
				return _this2.removeNodeModule(path);
			});

			var modulesDefer = _q2.default.defer();
			this.modulesWatcher.on('ready', function () {
				return modulesDefer.resolve();
			});
			return modulesDefer.promise;
		}
	}, {
		key: 'watchFiles',
		value: function watchFiles() {
			var _this3 = this;

			var options = { cwd: this.project.getProjectRoot() };
			this.watcher = _chokidar2.default.watch(this.project.getGlobString(), options);
			this.watcher.on('add', function (path) {
				return _this3.updateFile(path);
			});
			this.watcher.on('change', function (path) {
				return _this3.updateFile(path);
			});
			this.watcher.on('unlink', function (path) {
				return _this3.removeFile(path);
			});
			var watcherDefer = _q2.default.defer();
			this.watcher.on('ready', function () {
				return watcherDefer.resolve();
			});

			return watcherDefer.promise;
		}
	}]);

	return Scanner;
}();