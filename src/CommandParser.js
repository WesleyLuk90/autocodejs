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
			case 'listExports':
				return this.listExports(commandObject);
			default:
				throw new Error(`Unknown action ${action}`);
		}
	}

	listExports(commandObject) {
		const file = commandObject.file;
		const exportList = this.project.listExports(file);
		console.log(JSON.stringify({ exportList }));
	}
}
