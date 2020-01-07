import { Database } from './database';
import { ApplicationServer } from './application-server';
import { Express } from 'express';

export class Application {
  static async createApplication(): Promise<Express> {
    await Database.connect();
    return await ApplicationServer.setup();
  }
}
