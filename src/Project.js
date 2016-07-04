import Q from 'q';
import { readFile } from 'fs';
import { join } from 'path';

export class Project {
	constructor(projectRoot) {
		this.projectRoot = projectRoot;
		this.filesByPath = new Map();
	}

	getRCPath() {
		return join(this.projectRoot, '.autocodejsrc');
	}

	getProjectRoot() {
		return this.projectRoot;
	}

	load() {
		return Q.nfcall(readFile, this.getRCPath(), 'utf-8')
			.then(text => JSON.parse(text))
			.then(project => { this.project = project; });
	}

	getGlobString() {
		return this.project.paths;
	}

	getSourceType() {
		return this.project.sourceType || 'module';
	}

	addFile(file) {
		this.filesByPath.set(file.getPath(), file);
	}

	removeFile(file) {
		this.filesByPath.delete(file);
	}

	listExports(relativeFile) {
		const exportsList = [];
		this.filesByPath.forEach(file => {
			const exportInfo = {};
			exportInfo.path = file.getImportPath(relativeFile);
			exportInfo.names = file.getExportedNames();
			if (exportInfo.names.length > 0) {
				exportsList.push(exportInfo);
			}
		});
		return exportsList;
	}
}
