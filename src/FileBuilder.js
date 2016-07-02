import { File } from './File';
import Q from 'q';
import { readFile } from 'fs';
import { join } from 'path';

export class FileBuilder {
	static createFile(project, path) {
		const fullPath = join(project.getProjectRoot(), path);
		return Q.nfcall(readFile, fullPath, 'utf-8')
			.then(contents => new File(fullPath, contents, project));
	}
}
