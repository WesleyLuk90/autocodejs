'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.File = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _FileExport = require('./FileExport');

var _FileImport = require('./FileImport');

var _path = require('path');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var File = exports.File = function () {
	function File(path, contents, project) {
		_classCallCheck(this, File);

		this.path = path;
		this.contents = contents;
		this.project = project;
		this.preprocess();
	}

	_createClass(File, [{
		key: 'getPath',
		value: function getPath() {
			return this.path;
		}
	}, {
		key: 'getAbsolutePath',
		value: function getAbsolutePath() {
			return (0, _path.join)(this.project.getProjectRoot(), this.path);
		}
	}, {
		key: 'preprocess',
		value: function preprocess() {
			this.parse();
			this.scanExports();
			this.scanImports();
		}
	}, {
		key: 'parse',
		value: function parse() {
			var options = {
				sourceType: this.project.getSourceType()
			};
			this.ast = this.project.getCodeParser().parse(this.contents, options);
		}
	}, {
		key: 'getBody',
		value: function getBody() {
			return this.ast.program.body;
		}
	}, {
		key: 'scanExports',
		value: function scanExports() {
			var _this = this;

			var exportStatements = this.getBody().filter(function (node) {
				return File.isExport(node);
			}).map(function (statement) {
				return new _FileExport.FileExport(_this, statement);
			});
			this.exportStatements = exportStatements;
		}
	}, {
		key: 'scanImports',
		value: function scanImports() {
			var _this2 = this;

			var importStatements = this.getBody().filter(function (node) {
				return File.isImport(node);
			}).map(function (statement) {
				return new _FileImport.FileImport(_this2, statement);
			});
			this.importStatements = importStatements;
		}
	}, {
		key: 'getExports',
		value: function getExports() {
			return this.exportStatements;
		}
	}, {
		key: 'getImportPath',
		value: function getImportPath(relativeTo, optionsOrNull) {
			var options = optionsOrNull || {};
			var directory = (0, _path.dirname)(relativeTo);
			var relativePath = (0, _path.relative)(directory, this.getAbsolutePath()).replace(/\\/g, '/');
			if (!options.keepFileExtension) {
				relativePath = relativePath.replace(/\.[a-z0-9]+$/i, '');
			}
			if (!relativePath.startsWith('.')) {
				relativePath = './' + relativePath;
			}
			return relativePath;
		}
	}, {
		key: 'getExportedNames',
		value: function getExportedNames() {
			return _lodash2.default.flatten(this.exportStatements.map(function (st) {
				return st.getExportedNames();
			}));
		}
	}], [{
		key: 'isExport',
		value: function isExport(node) {
			switch (node.type) {
				case 'ExportNamedDeclaration':
				case 'ExportSpecifier':
				case 'ExportDefaultDeclaration':
				case 'ExportAllDeclaration':
					return true;
				default:
					return false;
			}
		}
	}, {
		key: 'isImport',
		value: function isImport(node) {
			switch (node.type) {
				case 'ImportDeclaration':
				case 'ImportSpecifier':
				case 'ImportDefaultSpecifier':
				case 'ImportNamespaceSpecifier':
					return true;
				default:
					return false;
			}
		}
	}]);

	return File;
}();