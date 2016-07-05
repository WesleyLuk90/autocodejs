export class ConsoleReader {
	constructor(commandParser) {
		this.commandParser = commandParser;
		this.buffer = '';
	}

	start() {
		process.stdin.on('readable', () => this.readData());
	}

	readData() {
		const input = process.stdin.read();
		if (!input) {
			return;
		}
		this.buffer += input.toString('utf-8');

		let index = this.buffer.indexOf('\n');
		while (index > -1) {
			const command = this.buffer.substring(0, index);
			this.buffer = this.buffer.substring(index + 1);
			this.handleCommand(command);
			index = this.buffer.indexOf('\n');
		}
	}

	handleCommand(command) {
		if (!command) {
			return;
		}
		try {
			const result = this.commandParser.parse(command);
			console.log(result);
		} catch (e) {
			console.error(e.stack);
		}
	}
}
