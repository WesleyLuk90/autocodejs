'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.File = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _babylon = require('babylon');

var babylon = _interopRequireWildcard(_babylon);

var _FileExport = require('./FileExport');

var _FileImport = require('./FileImport');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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
			this.ast = babylon.parse(this.contents, options);
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
				switch (node.type) {
					case 'ExportNamedDeclaration':
					case 'ExportSpecifier':
					case 'ExportDefaultDeclaration':
					case 'ExportAllDeclaration':
						return true;
					default:
						return false;
				}
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
				switch (node.type) {
					case 'ImportDeclaration':
					case 'ImportSpecifier':
					case 'ImportDefaultSpecifier':
					case 'ImportNamespaceSpecifier':
						return true;
					default:
						return false;
				}
			}).map(function (statement) {
				return new _FileImport.FileImport(_this2, statement);
			});
			this.importStatements = importStatements;
			console.log(importStatements.map(function (s) {
				return s.getImportPath() + ' ' + s.getImportedNames();
			}));
		}
	}]);

	return File;
}();