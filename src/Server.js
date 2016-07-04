import { createServer } from 'http';

export class Server {

	constructor(commandProcessor) {
		this.commandProcessor = commandProcessor;
	}

	start(port) {
		this.server = createServer((req, res) => this.handleRequest(req, res));
		this.server.listen(port, '127.0.0.1');
	}

	stop() {
		this.server.close();
	}

	handleRequest(req, res) {
		this.getBody(req, (body) => {
			try {
				const response = this.commandProcessor.parse(body);
				res.end(response);
			} catch (e) {
				console.error(e.stack);
			}
		});
	}

	getBody(request, callback) {
		const body = [];
		request.on('data', (chunk) => {
			body.push(chunk);
		}).on('end', () => {
			callback(Buffer.concat(body).toString());
		});
	}
}
