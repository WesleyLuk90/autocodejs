export class CommandParser {
	constructor(project) {
		this.project = project;
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

	listImports(commandObject) {
		const file = commandObject.file;
		const importList = this.project.listExports(file);
		const modules = this.project.getModules(file);
		return JSON.stringify({ importList, modules });
	}

	getInsertPoint(commandObject) {
		const contents = commandObject.contents;
		const insertPoint = this.project.findInsertPoint(contents);
		return JSON.stringify({ insertPoint });
	}
}
