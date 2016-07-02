import minimist from 'minimist';
import { Scanner } from './Scanner';
import { Project } from './Project';

function main() {
	const argv = minimist(process.argv);

	const projectPath = argv['project-path'];
	if (!projectPath) {
		console.log('--project-path must be provided');
		return;
	}

	const project = new Project(projectPath);

	project
		.load()
		.then(() => {
			const scanner = new Scanner(project);
			return scanner.getFiles();
		})
		.done();
}

main();
