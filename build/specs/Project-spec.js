'use strict';

var _Project = require('../Project');

describe('Project', function () {
	it('should correctly find the insertion point', function () {
		var project = new _Project.Project();
		expect(project.findInsertPoint('')).toEqual(0);
		var source = 'function test(){};import {hello} from "./world";';
		expect(project.findInsertPoint(source)).toEqual(source.length);
		var source2 = ['function test(){};', // 18
		'import {hello} from "./world";', // 30
		'"a string";', // 11
		'import {hello} from "./world";', // 30
		'"world";'].join('');
		expect(project.findInsertPoint(source2)).toEqual(18 + 30 + 11 + 30);

		var syntaxErrorCode = 'function test!!!!(){};';
		expect(project.findInsertPoint(syntaxErrorCode)).toEqual(0);
	});

	it('should correctly convert the module names', function () {
		var project = new _Project.Project();
		project.setOptions({});

		expect(project.convertModuleName('q')).toEqual('Q');
		expect(project.convertModuleName('lodash')).toEqual('_');
		expect(project.convertModuleName('react')).toEqual('React');
		expect(project.convertModuleName('my-other-module')).toEqual('myOtherModule');
	});

	it('should correctly convert a path to a module name', function () {
		var project = new _Project.Project();

		expect(project.pathToModuleName('some-module')).toEqual('someModule');
		expect(project.pathToModuleName('/a/nother/module')).toEqual('module');
		expect(project.pathToModuleName('module.js')).toEqual('module');
		expect(project.pathToModuleName('/anUpper/CasedModule')).toEqual('casedModule');
	});
});