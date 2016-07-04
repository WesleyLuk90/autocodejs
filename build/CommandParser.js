'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CommandParser = exports.CommandParser = function () {
	function CommandParser(project) {
		_classCallCheck(this, CommandParser);

		this.project = project;
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
				case 'listExports':
					return this.listExports(commandObject);
				default:
					throw new Error('Unknown action ' + action);
			}
		}
	}, {
		key: 'listExports',
		value: function listExports(commandObject) {
			var file = commandObject.file;
			var exportList = this.project.listExports(file);
			console.log(JSON.stringify({ exportList: exportList }));
		}
	}]);

	return CommandParser;
}();