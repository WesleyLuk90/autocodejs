import * as babylon from 'babylon';
import _ from 'lodash';

export class CodeParser {
	constructor(options) {
		const defaults = {
			sourceType: 'module',
			plugins: [],
		};
		_.defaults(options, defaults);
		this.options = options;
	}

	parse(code) {
		return babylon.parse(code, this.options);
	}
}
