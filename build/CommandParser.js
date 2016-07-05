'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CommandParser = exports.CommandParser = function () {
	function CommandParser(project, options) {
		_classCallCheck(this, CommandParser);

		this.project = project;
		this.options = options;
	}

	_createClass(CommandParser, [{
		key: 'parse',
		value: function parse(command) {
			if (!command) {
				return null;
			}
			var commandObject = JSON.parse(command);
			var action = commandObject.action;

			switch (action) {
				case 'listImports':
					return this.listImports(commandObject);
				case 'getInsertPoint':
					return this.getInsertPoint(commandObject);
				default:
					throw new Error('Unknown action ' + action);
			}
		}
	}, {
		key: 'formatJSON',
		value: function formatJSON(object) {
			var spaces = this.options.prettyPrint ? 4 : 0;
			return JSON.stringify(object, null, spaces);
		}
	}, {
		key: 'listImports',
		value: function listImports(commandObject) {
			var file = commandObject.file;
			if (!file) {
				throw new Error('Parameter file must be provided');
			}
			var importList = this.project.listExports(file);
			var modules = this.project.getModules(file);
			return this.formatJSON({ importList: importList, modules: modules });
		}
	}, {
		key: 'getInsertPoint',
		value: function getInsertPoint(commandObject) {
			var contents = commandObject.contents;
			var insertPoint = this.project.findInsertPoint(contents);
			return this.formatJSON({ insertPoint: insertPoint });
		}
	}]);

	return CommandParser;
}();