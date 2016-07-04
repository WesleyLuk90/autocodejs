import * as babylon from 'babylon';

export class CodeParser {
	constructor(options) {
		this.options = options || { sourceType: 'module' };
	}

	parse(code) {
		return babylon.parse(code, this.options);
	}
}
