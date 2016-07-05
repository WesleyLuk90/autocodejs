export class CommandParser {
	constructor(project, options) {
		this.project = project;
		this.options = options;
	}

	parse(command) {
		if (!command) {
			return null;
		}
		const commandObject = JSON.parse(command);
		const action = commandObject.action;

		switch (action) {
			case 'listImports':
				return this.listImports(commandObject);
			case 'getInsertPoint':
				return this.getInsertPoint(commandObject);
			default:
				throw new Error(`Unknown action ${action}`);
		}
	}

	formatJSON(object) {
		const spaces = this.options.prettyPrint ? 4 : 0;
		return JSON.stringify(object, null, spaces);
	}

	listImports(commandObject) {
		const file = commandObject.file;
		if (!file) {
			throw new Error('Parameter file must be provided');
		}
		const importList = this.project.listExports(file);
		const modules = this.project.getModules(file);
		return this.formatJSON({ importList, modules });
	}

	getInsertPoint(commandObject) {
		const contents = commandObject.contents;
		const insertPoint = this.project.findInsertPoint(contents);
		return this.formatJSON({ insertPoint });
	}
}
