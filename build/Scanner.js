'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Scanner = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _q = require('q');

var _q2 = _interopRequireDefault(_q);

var _FileBuilder = require('./FileBuilder');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Scanner = exports.Scanner = function () {
	function Scanner(project) {
		_classCallCheck(this, Scanner);

		this.project = project;
	}

	_createClass(Scanner, [{
		key: 'getFiles',
		value: function getFiles() {
			var _this = this;

			var options = {
				cwd: this.project.getProjectRoot()
			};
			console.log(this.project.getGlobString(), options);
			return _q2.default.nfcall(_glob2.default, this.project.getGlobString(), options).then(function (files) {
				return _q2.default.all(files.map(function (path) {
					return _FileBuilder.FileBuilder.createFile(_this.project, path);
				}));
			});
			// .then(files => console.log(files));
		}
	}]);

	return Scanner;
}();