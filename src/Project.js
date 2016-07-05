import Q from 'q';
import { readFile } from 'fs';
import { join } from 'path';
import _ from 'lodash';
import { CodeParser } from './CodeParser';
import { File } from './File';

export class Project {
	constructor(projectRoot) {
		this.projectRoot = projectRoot;
		this.filesByPath = new Map();
		this.nodeModules = new Set();
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
			.then(options => this.setOptions(options));
	}

	getGlobString() {
		return this.options.paths;
	}

	getNameOverrides() {
		if (!this.options.moduleNames) {
			return {
				q: 'Q',
				lodash: '_',
				react: 'React',
			};
		}
		return this.options.moduleNames;
	}

	setOptions(options) {
		this.options = options;
	}

	convertModuleName(name) {
		const overrides = this.getNameOverrides();
		if (overrides[name]) {
			return overrides[name];
		}
		return this.camelCaseSymbols(name);
	}

	camelCaseSymbols(name) {
		return name.replace(/[^\w]+(\w?)/g, (match, firstLetter) => firstLetter.toUpperCase());
	}

	pathToModuleName(name) {
		const finalPart = name.match(/\/?([^\/\.]+)(\..*)?$/)[1];
		return this.camelCaseSymbols(finalPart
			.replace(/^\w/, (match) => match.toLowerCase()));
	}

	getSourceType() {
		return this.options.sourceType || 'module';
	}

	addFile(file) {
		this.filesByPath.set(file.getPath(), file);
	}

	removeFile(file) {
		this.filesByPath.delete(file);
	}

	countSlashes(path) {
		let count = 0;
		for (let i = 0; i < path.length; i++) {
			if (path.charAt(i) === '/') {
				count++;
			}
		}
		return count;
	}

	getCodeParser() {
		return new CodeParser();
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
		const orderedExportsList = _.orderBy(
			exportsList, [(e) => this.countSlashes(e.path), (e) => e.path]
		);
		return orderedExportsList;
	}

	addNodeModule(path) {
		this.nodeModules.add(path);
	}

	removeNodeModule(path) {
		this.nodeModules.delete(path);
	}

	getModules(relativeFile) {
		const modules = [];
		this.nodeModules.forEach(module => modules.push({
			path: module,
			name: this.convertModuleName(module),
		}));
		this.filesByPath.forEach(file => {
			const relativeImport = file.getImportPath(relativeFile);
			modules.push({
				path: relativeImport,
				name: this.pathToModuleName(relativeImport),
			});
		});
		return modules;
	}

	findInsertPoint(fileContents) {
		let insertPoint = 0;
		try {
			const file = this.getCodeParser().parse(fileContents);
			file.program.body.forEach(statement => {
				if (File.isImport(statement)) {
					insertPoint = statement.end;
				}
			});
			return insertPoint;
		} catch (e) {
			// Default to the start of the file for the insert point
			return insertPoint;
		}
	}
}
