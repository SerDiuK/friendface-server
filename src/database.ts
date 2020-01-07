import mongoose from 'mongoose';
import { LoggerService } from './services/logger.service';

const logger = LoggerService.getInstance();

export class Database {
  static async connect(): Promise<void> {
    const db = await mongoose.connect(process.env.MONGODB, { useNewUrlParser: true })
      .then(() => logger.debug('MongoDB Connected'))
      .catch(err => logger.error('Database connection error' + err));
    mongoose.set('useFindAndModify', false);

    return db;
  }
}
