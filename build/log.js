'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.log = log;
exports.error = error;

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _path = require('path');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var directory = (0, _path.dirname)(__dirname);
var path = (0, _path.join)(directory, 'autocodejs.log');

_winston2.default.add(_winston2.default.transports.File, {
	filename: path,
	handleExceptions: true,
	humanReadableUnhandledException: true
});
_winston2.default.remove(_winston2.default.transports.Console);

function log() {
	for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
		args[_key] = arguments[_key];
	}

	_winston2.default.info.apply(_winston2.default, args);
}

function error() {
	for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
		args[_key2] = arguments[_key2];
	}

	_winston2.default.error.apply(_winston2.default, args);
}