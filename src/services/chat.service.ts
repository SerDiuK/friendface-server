import { ChatMessage } from '../models/chat';
import { LoggerService } from './logger.service';
import moment from 'moment';

import MessageSchema from '../models/chat';
const logger = LoggerService.getInstance();

export class ChatService {
  private static instance: ChatService;

  static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }

    return ChatService.instance;
  }

  getAllMessages(): Promise<ChatMessage[]> {
    return MessageSchema.find({})
      .sort('timestamp')
      .exec().then(messages => {
        logger.info('getAllMessages SUCCESS', messages);
        return messages;
      }).catch(err => {
        logger.error('getAllMessages FAILED', err);
        return err;
      });
  }

  postMessage(body: ChatMessage): Promise<ChatMessage> {
    const newMessage = new MessageSchema({
      ...body,
      timestamp: moment().format('YYYY-MM-DD HH:mm:ss')
    });

    return newMessage.save().then(msg => {
      logger.info('postMessage SUCCESS', msg);
      return msg;
    }).catch(err => {
      logger.error('postMessage FAILED', err);
      return err;
    });
  }

  deleteMessages(): Promise<void> {
    return MessageSchema.deleteMany({}).then(messages => {
      logger.info('deleteMessages SUCCESS', messages);
      return {};
    }).catch(err => {
      logger.error('deleteMessages FAILED', err);
      return err;
    });
  }
}
