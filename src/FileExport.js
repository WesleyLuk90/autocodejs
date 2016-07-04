

export class FileExport {
	constructor(file, exportedNode) {
		this.file = file;
		this.exportedNode = exportedNode;
	}

	getIdentifierName(identifier) {
		return identifier.name;
	}

	getDeclarationExports(node) {
		const declaration = node.declaration;
		switch (declaration.type) {
			case 'VariableDeclaration':
				return declaration.declarations.map(decl => decl.id.name);
			case 'ClassDeclaration':
			case 'FunctionDeclaration':
				return [node.declaration.id.name];
			default:
				console.log(node);
				throw new Error(`Invalid declaration type ${declaration.type}`);
		}
	}

	getExportedNames() {
		const node = this.exportedNode;
		switch (node.type) {
			case 'ExportNamedDeclaration':
				return this.getDeclarationExports(node);
			case 'ExportSpecifier':
				return [this.getIdentifierName(node.exported)];
			case 'ExportDefaultDeclaration':
				return [];
			case 'ExportAllDeclaration':
				return [];
			default:
				throw new Error(`Invalid export ${node.type}`);
		}
	}

	getImportPath(relativeTo, options) {

	}
}
