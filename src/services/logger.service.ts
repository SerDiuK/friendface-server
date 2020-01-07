import bunyan from 'bunyan';
import fs from 'fs';
import path from 'path';
import Logger = require('bunyan');

export class LoggerService {
  private static instance: LoggerService;

  private logger: Logger;

  constructor() {
    this.createLogger();
  }

  static getInstance(): Logger {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService();
    }

    return LoggerService.instance.logger;
  }

  private createLogger(): void {
    const logDirectory = path.join(__dirname, '../log/');

    if (!fs.existsSync(logDirectory)) {
      fs.mkdirSync(logDirectory);
    }

    this.logger = bunyan.createLogger({
      name: 'FriendFace',
      streams: [
        {
          level: 'debug',
          stream: process.stdout
        },
        {
          level: 'error',
          path: logDirectory + 'error.log'
        }
      ]
    });
  }
}
