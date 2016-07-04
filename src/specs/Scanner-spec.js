import { Scanner } from '../Scanner';

describe('Scanner', () => {
	it('should determine the node module name', () => {
		const scanner = new Scanner();
		expect(scanner.getModuleName('node_modules/stuff')).toEqual('stuff');
		expect(scanner.getModuleName('things')).toEqual('things');
		expect(scanner.getModuleName('/some/path/here/node_modules/thing12')).toEqual('thing12');
	});
});
