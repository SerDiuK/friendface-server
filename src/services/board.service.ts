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
        logger.info('getBoardMessages SUCCESS', messages);
        return messages;
      }).catch(err => {
        logger.error('getBoardMessages FAILED', err);
        return err;
      });
  }

  postBoardMessage(body: BoardMessage): Promise<BoardMessage> {
    const newMessage = new BoardMessageSchema({
      ...body,
      timestamp: moment().format()
    });

    return newMessage.save().then(msg => {
      logger.info('postChatMessage SUCCESS', msg);
      return msg;
    }).catch(err => {
      logger.error('postChatMessage FAILED', err);
      return err;
    });
  }
}
