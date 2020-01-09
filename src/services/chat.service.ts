import moment from 'moment';
import ChatMessageSchema, { ChatMessage } from '../models/chat-message';
import { LoggerService } from './logger.service';
import { WebSocketService } from './websocket.service';

const logger = LoggerService.getInstance();
const wsService = WebSocketService.getInstance();

export class ChatService {
  private static instance: ChatService;

  static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }

    return ChatService.instance;
  }

  getAllMessages(): Promise<ChatMessage[]> {
    return ChatMessageSchema.find({})
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
    const newMessage = new ChatMessageSchema({
      ...body,
      timestamp: moment().format()
    });

    return newMessage.save().then(async msg => {
      logger.info('postMessage SUCCESS', msg);
      return msg;
    }).catch(err => {
      logger.error('postMessage FAILED', err);
      return err;
    });
  }

  deleteMessages(): Promise<void> {
    return ChatMessageSchema.deleteMany({}).then(messages => {
      logger.info('deleteMessages SUCCESS', messages);
      return {};
    }).catch(err => {
      logger.error('deleteMessages FAILED', err);
      return err;
    });
  }
}
