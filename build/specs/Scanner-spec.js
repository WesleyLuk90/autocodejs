'use strict';

var _Scanner = require('../Scanner');

describe('Scanner', function () {
	it('should determine the node module name', function () {
		var scanner = new _Scanner.Scanner();
		expect(scanner.getModuleName('node_modules/stuff')).toEqual('stuff');
		expect(scanner.getModuleName('things')).toEqual('things');
		expect(scanner.getModuleName('/some/path/here/node_modules/thing12')).toEqual('thing12');
	});
});