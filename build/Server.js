'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Server = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _http = require('http');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Server = exports.Server = function () {
	function Server(commandProcessor) {
		_classCallCheck(this, Server);

		this.commandProcessor = commandProcessor;
	}

	_createClass(Server, [{
		key: 'start',
		value: function start(port) {
			var _this = this;

			this.server = (0, _http.createServer)(function (req, res) {
				return _this.handleRequest(req, res);
			});
			this.server.listen(port, '127.0.0.1');
		}
	}, {
		key: 'stop',
		value: function stop() {
			this.server.close();
		}
	}, {
		key: 'handleRequest',
		value: function handleRequest(req, res) {
			var _this2 = this;

			this.getBody(req, function (body) {
				try {
					var response = _this2.commandProcessor.parse(body);
					res.end(response);
				} catch (e) {
					console.error(e.stack);
				}
			});
		}
	}, {
		key: 'getBody',
		value: function getBody(request, callback) {
			var body = [];
			request.on('data', function (chunk) {
				body.push(chunk);
			}).on('end', function () {
				callback(Buffer.concat(body).toString());
			});
		}
	}]);

	return Server;
}();