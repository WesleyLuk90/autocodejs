export class FileImport {
	constructor(file, importedNode) {
		this.file = file;
		this.importedNode = importedNode;
	}

	getImportPath() {
		return this.importedNode.source.value;
	}

	getImportName(specifier) {
		return specifier.imported.name;
	}

	getLocalImportName(specifier) {
		return specifier.local.name;
	}

	getImportedNames() {
		const node = this.importedNode;
		switch (node.type) {
			case 'ImportDeclaration':
				return node.specifiers.map(s => this.getLocalImportName(s));
			case 'ImportSpecifier':
			case 'ImportDefaultSpecifier':
			case 'ImportNamespaceSpecifier':
			default:
				throw new Error(`Invalid import ${node.type}`);
		}
	}
}
