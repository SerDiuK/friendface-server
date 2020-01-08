import BoardMessageSchema, { BoardMessage } from '../models/board-message';
import { LoggerService } from './logger.service';
import moment from 'moment';

const logger = LoggerService.getInstance();

export class BoardService {
  private static instance: BoardService;

  static getInstance(): BoardService {
    if (!BoardService.instance) {
      BoardService.instance = new BoardService();
    }

    return BoardService.instance;
  }

  getAllMessages(): Promise<BoardMessage[]> {
    return BoardMessageSchema.find({})
      .sort('timestamp')
      .exec().then(messages => {
        logger.info('getAllMessages SUCCESS', messages);
        return messages;
      }).catch(err => {
        logger.error('getAllMessages FAILED', err);
        return err;
      });
  }

  postMessage(body: BoardMessage): Promise<BoardMessage> {
    const newMessage = new BoardMessageSchema({
      ...body,
      timestamp: moment().format()
    });

    return newMessage.save().then(msg => {
      logger.info('postMessage SUCCESS', msg);
      return msg;
    }).catch(err => {
      logger.error('postMessage FAILED', err);
      return err;
    });
  }
}
