import moment from 'moment';
import ChatMessageSchema, { ChatMessage } from '../models/chat-message';
import { LoggerService } from './logger.service';
import { ErrorResponse } from '../utils/service-utils';

const logger = LoggerService.getInstance();

export class ChatMessagesService {
  private static instance: ChatMessagesService;

  static getInstance(): ChatMessagesService {
    if (!ChatMessagesService.instance) {
      ChatMessagesService.instance = new ChatMessagesService();
    }

    return ChatMessagesService.instance;
  }

  getChatMessages(): Promise<ChatMessage[] | ErrorResponse> {
    return ChatMessageSchema.find({})
      .sort('timestamp')
      .exec().then(messages => {
        logger.info('getChatMessages SUCCESS', messages);
        return messages;
      }).catch(error => {
        logger.error('getChatMessages FAILED', error);
        return { status: 400, error};
      });
  }

  getChatByChannelId(channel: string): Promise<ChatMessage[]| ErrorResponse> {
    return ChatMessageSchema.find({ channel })
      .sort('timestamp')
      .exec().then(messages => {
        logger.info('getChatByChannelId SUCCESS', messages);
        return messages;
      }).catch(error => {
        logger.error('getChatByChannelId FAILED', error);
        return { status: 400, error};
      });
  }

  postChatMessage(body: ChatMessage): Promise<ChatMessage | ErrorResponse> {
    const newMessage = new ChatMessageSchema({
      ...body,
      timestamp: moment().format()
    });

    return newMessage.save().then(async msg => {
      logger.info('postChatMessage SUCCESS', msg);
      return msg;
    }).catch(error => {
      logger.error('postChatMessage FAILED', error);
      return { status: 400, error};
    });
  }

  deleteChatMessages(): Promise<{} | ErrorResponse> {
    return ChatMessageSchema.deleteMany({}).then(() => {
      logger.info('deleteChatMessages SUCCESS');
      return {};
    }).catch(error => {
      logger.error('deleteChatMessages FAILED', error);
      return { status: 400, error};
    });
  }
}
