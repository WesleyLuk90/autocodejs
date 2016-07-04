import { FileBuilder } from './FileBuilder';
import chokidir from 'chokidar';

export class Scanner {
	constructor(project) {
		this.project = project;
	}

	updateFile(path) {
		return FileBuilder.createFile(this.project, path)
			.then(file => this.project.addFile(file))
			.catch(e => console.error(e.stack));
	}

	removeFile(path) {
		this.project.removeFile(path);
	}

	addNodeModule(path) {
		this.project.addNodeModule(this.getModuleName(path));
	}

	removeNodeModule(path) {
		this.project.removeNodeModule(this.getModuleName(path));
	}

	getModuleName(path) {
		return path.replace(/.*[\/\\]([^\/\\]+)/, '$1');
	}

	watch() {
		const options = { cwd: this.project.getProjectRoot() };
		this.watcher = chokidir.watch(this.project.getGlobString(), options);
		this.watcher.on('add', (path) => this.updateFile(path));
		this.watcher.on('change', (path) => this.updateFile(path));
		this.watcher.on('unlink', (path) => this.removeFile(path));

		const modulesOptions = { cwd: this.project.getProjectRoot() };
		this.modulesWatcher = chokidir.watch('node_modules/*', modulesOptions);
		this.modulesWatcher.on('addDir', (path) => this.addNodeModule(path));
		this.modulesWatcher.on('unlinkDir', (path) => this.removeNodeModule(path));
	}
}
