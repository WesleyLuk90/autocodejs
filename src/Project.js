import Q from 'q';
import { readFile } from 'fs';
import { join } from 'path';

export class Project {
	constructor(projectRoot) {
		this.projectRoot = projectRoot;
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
}
