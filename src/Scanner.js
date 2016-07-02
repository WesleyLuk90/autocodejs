import glob from 'glob';
import Q from 'q';
import { FileBuilder } from './FileBuilder';

export class Scanner {
	constructor(project) {
		this.project = project;
	}

	getFiles() {
		const options = {
			cwd: this.project.getProjectRoot(),
		};
		console.log(this.project.getGlobString(), options);
		return Q.nfcall(glob, this.project.getGlobString(), options)
			.then(files => Q.all(
				files.map(path => FileBuilder.createFile(this.project, path))
			))
			// .then(files => console.log(files));
	}
}
