import winston from 'winston';
import { join, dirname } from 'path';

const directory = dirname(__dirname);
const path = join(directory, 'autocodejs.log');

winston.add(winston.transports.File, {
	filename: path,
	handleExceptions: true,
	humanReadableUnhandledException: true,
});
winston.remove(winston.transports.Console);

export function log(...args) {
	winston.info.apply(winston, args);
}

export function error(...args) {
	winston.error.apply(winston, args);
}
