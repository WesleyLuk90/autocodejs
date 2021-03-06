'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Project = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _q = require('q');

var _q2 = _interopRequireDefault(_q);

var _fs = require('fs');

var _path = require('path');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _CodeParser = require('./CodeParser');

var _File = require('./File');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Project = exports.Project = function () {
	function Project(projectRoot) {
		_classCallCheck(this, Project);

		this.projectRoot = projectRoot;
		this.filesByPath = new Map();
		this.nodeModules = new Set();
	}

	_createClass(Project, [{
		key: 'getRCPath',
		value: function getRCPath() {
			return (0, _path.join)(this.projectRoot, '.autocodejsrc');
		}
	}, {
		key: 'getProjectRoot',
		value: function getProjectRoot() {
			return this.projectRoot;
		}
	}, {
		key: 'load',
		value: function load() {
			var _this = this;

			return _q2.default.nfcall(_fs.readFile, this.getRCPath(), 'utf-8').then(function (text) {
				return JSON.parse(text);
			}).then(function (options) {
				return _this.setOptions(options);
			});
		}
	}, {
		key: 'getGlobString',
		value: function getGlobString() {
			return this.options.paths;
		}
	}, {
		key: 'getNameOverrides',
		value: function getNameOverrides() {
			if (!this.options.moduleNames) {
				return {
					q: 'Q',
					lodash: '_',
					react: 'React'
				};
			}
			return this.options.moduleNames;
		}
	}, {
		key: 'setOptions',
		value: function setOptions(options) {
			this.options = options;
		}
	}, {
		key: 'convertModuleName',
		value: function convertModuleName(name) {
			var overrides = this.getNameOverrides();
			if (overrides[name]) {
				return overrides[name];
			}
			return this.camelCaseSymbols(name);
		}
	}, {
		key: 'camelCaseSymbols',
		value: function camelCaseSymbols(name) {
			return name.replace(/[^\w]+(\w?)/g, function (match, firstLetter) {
				return firstLetter.toUpperCase();
			});
		}
	}, {
		key: 'pathToModuleName',
		value: function pathToModuleName(name) {
			var finalPart = name.match(/\/?([^\/\.]+)(\..*)?$/)[1];
			return this.camelCaseSymbols(finalPart.replace(/^\w/, function (match) {
				return match.toLowerCase();
			}));
		}
	}, {
		key: 'getSourceType',
		value: function getSourceType() {
			return this.options.sourceType || 'module';
		}
	}, {
		key: 'addFile',
		value: function addFile(file) {
			this.filesByPath.set(file.getPath(), file);
		}
	}, {
		key: 'removeFile',
		value: function removeFile(file) {
			this.filesByPath.delete(file);
		}
	}, {
		key: 'countSlashes',
		value: function countSlashes(path) {
			var count = 0;
			for (var i = 0; i < path.length; i++) {
				if (path.charAt(i) === '/') {
					count++;
				}
			}
			return count;
		}
	}, {
		key: 'getCodeParser',
		value: function getCodeParser() {
			return new _CodeParser.CodeParser(this.options);
		}
	}, {
		key: 'listExports',
		value: function listExports(relativeFile) {
			var _this2 = this;

			var exportsList = [];
			this.filesByPath.forEach(function (file) {
				var exportInfo = {};
				exportInfo.path = file.getImportPath(relativeFile, { keepFileExtension: _this2.options.keepFileExtension });
				exportInfo.names = file.getExportedNames();
				if (exportInfo.names.length > 0) {
					exportsList.push(exportInfo);
				}
			});
			var orderedExportsList = _lodash2.default.orderBy(exportsList, [function (e) {
				return _this2.countSlashes(e.path);
			}, function (e) {
				return e.path;
			}]);
			return orderedExportsList;
		}
	}, {
		key: 'addNodeModule',
		value: function addNodeModule(path) {
			this.nodeModules.add(path);
		}
	}, {
		key: 'removeNodeModule',
		value: function removeNodeModule(path) {
			this.nodeModules.delete(path);
		}
	}, {
		key: 'getModules',
		value: function getModules(relativeFile) {
			var _this3 = this;

			var modules = [];
			this.nodeModules.forEach(function (module) {
				return modules.push({
					path: module,
					name: _this3.convertModuleName(module)
				});
			});
			this.filesByPath.forEach(function (file) {
				var relativeImport = file.getImportPath(relativeFile, { keepFileExtension: _this3.options.keepFileExtension });
				modules.push({
					path: relativeImport,
					name: _this3.pathToModuleName(relativeImport)
				});
			});
			return modules;
		}
	}, {
		key: 'findInsertPoint',
		value: function findInsertPoint(fileContents) {
			var insertPoint = 0;
			try {
				var file = this.getCodeParser().parse(fileContents);
				file.program.body.forEach(function (statement) {
					if (_File.File.isImport(statement)) {
						insertPoint = statement.end;
					}
				});
				return insertPoint;
			} catch (e) {
				// Default to the start of the file for the insert point
				return insertPoint;
			}
		}
	}]);

	return Project;
}();