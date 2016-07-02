'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FileExport = exports.FileExport = function () {
	function FileExport(file, exportedNode) {
		_classCallCheck(this, FileExport);

		this.file = file;
		this.exportedNode = exportedNode;
	}

	_createClass(FileExport, [{
		key: 'getIdentifierName',
		value: function getIdentifierName(identifier) {
			return identifier.name;
		}
	}, {
		key: 'getDeclarationExports',
		value: function getDeclarationExports(node) {
			var declaration = node.declaration;
			switch (declaration.type) {
				case 'VariableDeclaration':
					return declaration.declarations.map(function (decl) {
						return decl.id.name;
					});
				case 'ClassDeclaration':
				case 'FunctionDeclaration':
					return [node.declaration.id.name];
				default:
					console.log(node);
					throw new Error('Invalid declaration type ' + declaration.type);
			}
		}
	}, {
		key: 'getExportedNames',
		value: function getExportedNames() {
			var node = this.exportedNode;
			switch (node.type) {
				case 'ExportNamedDeclaration':
					return this.getDeclarationExports(node);
				case 'ExportSpecifier':
					return [this.getIdentifierName(node.exported)];
				case 'ExportDefaultDeclaration':
					return [];
				case 'ExportAllDeclaration':
					return [];
				default:
					throw new Error('Invalid export ' + node.type);
			}
		}
	}]);

	return FileExport;
}();