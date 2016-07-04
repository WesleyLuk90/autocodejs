import * as babylon from 'babylon';
import { FileExport } from './FileExport';
import { FileImport } from './FileImport';
import { dirname, relative, join } from 'path';
import _ from 'lodash';

export class File {
	constructor(path, contents, project) {
		this.path = path;
		this.contents = contents;
		this.project = project;
		this.preprocess();
	}

	getPath() {
		return this.path;
	}

	getAbsolutePath() {
		return join(this.project.getProjectRoot(), this.path);
	}

	preprocess() {
		this.parse();
		this.scanExports();
		this.scanImports();
	}

	parse() {
		const options = {
			sourceType: this.project.getSourceType(),
		};
		this.ast = babylon.parse(this.contents, options);
	}

	getBody() {
		return this.ast.program.body;
	}

	scanExports() {
		const exportStatements = this.getBody()
			.filter(node => {
				switch (node.type) {
					case 'ExportNamedDeclaration':
					case 'ExportSpecifier':
					case 'ExportDefaultDeclaration':
					case 'ExportAllDeclaration':
						return true;
					default:
						return false;
				}
			}).map(statement => new FileExport(this, statement));
		this.exportStatements = exportStatements;
	}

	scanImports() {
		const importStatements = this.getBody()
			.filter(node => {
				switch (node.type) {
					case 'ImportDeclaration':
					case 'ImportSpecifier':
					case 'ImportDefaultSpecifier':
					case 'ImportNamespaceSpecifier':
						return true;
					default:
						return false;
				}
			}).map(statement => new FileImport(this, statement));
		this.importStatements = importStatements;
	}

	getExports() {
		return this.exportStatements;
	}

	getImportPath(relativeTo, optionsOrNull) {
		const options = optionsOrNull || {};
		const directory = dirname(relativeTo);
		let relativePath = relative(directory, this.getAbsolutePath()).replace(/\\/g, '/');
		if (!options.keepFileExtension) {
			relativePath = relativePath.replace(/\.[a-z0-9]+$/i, '');
		}
		if (!relativePath.startsWith('.')) {
			relativePath = `./${relativePath}`;
		}
		return relativePath;
	}

	getExportedNames() {
		return _.flatten(this.exportStatements.map(st => st.getExportedNames()));
	}
}
