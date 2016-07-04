'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.FileBuilder = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _File = require('./File');

var _q = require('q');

var _q2 = _interopRequireDefault(_q);

var _fs = require('fs');

var _path = require('path');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FileBuilder = exports.FileBuilder = function () {
	function FileBuilder() {
		_classCallCheck(this, FileBuilder);
	}

	_createClass(FileBuilder, null, [{
		key: 'createFile',
		value: function createFile(project, path) {
			var fullPath = (0, _path.join)(project.getProjectRoot(), path);
			return _q2.default.nfcall(_fs.readFile, fullPath, 'utf-8').then(function (contents) {
				return new _File.File(path, contents, project);
			});
		}
	}]);

	return FileBuilder;
}();