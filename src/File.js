import * as babylon from 'babylon';
import { FileExport } from './FileExport';
import { FileImport } from './FileImport';

export class File {
	constructor(path, contents, project) {
		this.path = path;
		this.contents = contents;
		this.project = project;
		this.preprocess();
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
		console.log(importStatements.map(s => `${s.getImportPath()} ${s.getImportedNames()}`));
	}
}
