import config from 'config';
import dayjs from 'dayjs';

enum LogLevel {
  info = 'info',
  warn = 'warn',
  error = 'error',
  debug = 'debug',
}

const LogEmoji: { [key in LogLevel]: string } = {
  [LogLevel.info]: '🟢',
  [LogLevel.warn]: '🟠',
  [LogLevel.error]: '🔴',
  [LogLevel.debug]: '🔵',
};

type LogFn = (...params: any[]) => void;

interface ILogger {
  info: LogFn;
  warn: LogFn;
  error: LogFn;
  debug: LogFn;
}

function createLogMessage(type: LogLevel, ...params: object[]): string {
  return `${LogEmoji[type]} [${type.toUpperCase()}] ${dayjs().format(
    'YYYY-MM-DD:hh:mm:ss'
  )} ${params.map((p) => JSON.stringify(p)).join(' ')}`;
}

type PrintFn = (...data: any) => void;

function createLogFn(print: PrintFn, type: LogLevel): LogFn {
  return (message: string, ...params: any[]) => {
    print(createLogMessage(type, ...params));
  };
}

class Logger implements ILogger {
  info: LogFn = () => {};
  warn: LogFn = () => {};
  error: LogFn = () => {};
  debug: LogFn = () => {};

  constructor(logLevel: LogLevel) {
    switch (logLevel) {
      case 'info':
        this.info = createLogFn(console.info, LogLevel.info);
      case 'warn':
        this.warn = createLogFn(console.warn, LogLevel.warn);
      case 'error':
        this.error = createLogFn(console.error, LogLevel.error);
      case 'debug':
        this.debug = createLogFn(console.debug, LogLevel.debug);
    }
  }
}

const logLevel = config.get<LogLevel>('logLevel');

const log: ILogger = new Logger(logLevel);

export default log;
