import { Project } from '../Project';

describe('Project', () => {
	it('should correctly find the insertion point', () => {
		const project = new Project();
		expect(project.findInsertPoint('')).toEqual(0);
		const source = 'function test(){};import {hello} from "./world";';
		expect(project.findInsertPoint(source)).toEqual(source.length);
		const source2 = [
			'function test(){};', // 18
			'import {hello} from "./world";', // 30
			'"a string";', // 11
			'import {hello} from "./world";', // 30
			'"world";',
		].join('');
		expect(project.findInsertPoint(source2)).toEqual(18 + 30 + 11 + 30);

		const syntaxErrorCode = 'function test!!!!(){};';
		expect(project.findInsertPoint(syntaxErrorCode)).toEqual(0);
	});
});
