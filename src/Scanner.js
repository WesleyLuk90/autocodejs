import glob from 'glob';
import Q from 'q';
import { FileBuilder } from './FileBuilder';
import chokidir from 'chokidar';

export class Scanner {
	constructor(project) {
		this.project = project;
	}

	loadFiles() {
		const options = {
			cwd: this.project.getProjectRoot(),
		};
		return Q.nfcall(glob, this.project.getGlobString(), options)
			.then(files => Q.all(
				files.map(path => FileBuilder.createFile(this.project, path))
			))
			.then(files => this.project.setFiles(files));
	}

	watch() {
		const options = { cwd: this.project.getProjectRoot() };
		this.watcher = chokidir.watch(this.project.getGlobString(), options);
		this.watcher.on('add', (path) => {
			FileBuilder.createFile(this.project, path)
				.then(file => this.project.addFile(file))
				.catch(e => console.error(e.stack));
		});
		this.watcher.on('change', (path) => {
			FileBuilder.createFile(this.project, path)
				.then(file => this.project.addFile(file))
				.catch(e => console.error(e.stack));
		});
		this.watcher.on('unlink', (path) => {
			this.project.removeFile(path);
		});
	}
}
