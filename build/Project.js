'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Project = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _q = require('q');

var _q2 = _interopRequireDefault(_q);

var _fs = require('fs');

var _path = require('path');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Project = exports.Project = function () {
	function Project(projectRoot) {
		_classCallCheck(this, Project);

		this.projectRoot = projectRoot;
	}

	_createClass(Project, [{
		key: 'getRCPath',
		value: function getRCPath() {
			return (0, _path.join)(this.projectRoot, '.autocodejsrc');
		}
	}, {
		key: 'getProjectRoot',
		value: function getProjectRoot() {
			return this.projectRoot;
		}
	}, {
		key: 'load',
		value: function load() {
			var _this = this;

			return _q2.default.nfcall(_fs.readFile, this.getRCPath(), 'utf-8').then(function (text) {
				return JSON.parse(text);
			}).then(function (project) {
				_this.project = project;
			});
		}
	}, {
		key: 'getGlobString',
		value: function getGlobString() {
			return this.project.paths;
		}
	}, {
		key: 'getSourceType',
		value: function getSourceType() {
			return this.project.sourceType || 'module';
		}
	}]);

	return Project;
}();