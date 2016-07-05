'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ConsoleReader = exports.ConsoleReader = function () {
	function ConsoleReader(commandParser) {
		_classCallCheck(this, ConsoleReader);

		this.commandParser = commandParser;
		this.buffer = '';
	}

	_createClass(ConsoleReader, [{
		key: 'start',
		value: function start() {
			var _this = this;

			process.stdin.on('readable', function () {
				return _this.readData();
			});
		}
	}, {
		key: 'readData',
		value: function readData() {
			var input = process.stdin.read();
			if (!input) {
				return;
			}
			this.buffer += input.toString('utf-8');

			var index = this.buffer.indexOf('\n');
			while (index > -1) {
				var command = this.buffer.substring(0, index);
				this.buffer = this.buffer.substring(index + 1);
				this.handleCommand(command);
				index = this.buffer.indexOf('\n');
			}
		}
	}, {
		key: 'handleCommand',
		value: function handleCommand(command) {
			if (!command) {
				return;
			}
			var result = this.commandParser.parse(command);
			console.log(result);
		}
	}]);

	return ConsoleReader;
}();