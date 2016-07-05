'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.CodeParser = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _babylon = require('babylon');

var babylon = _interopRequireWildcard(_babylon);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CodeParser = exports.CodeParser = function () {
	function CodeParser(options) {
		_classCallCheck(this, CodeParser);

		var defaults = {
			sourceType: 'module',
			plugins: []
		};
		_lodash2.default.defaults(options, defaults);
		this.options = options;
	}

	_createClass(CodeParser, [{
		key: 'parse',
		value: function parse(code) {
			return babylon.parse(code, this.options);
		}
	}]);

	return CodeParser;
}();