import { WebSocketTopic } from '../models/websocket-message';
import { LoggerService } from '../services/logger.service';
import { Request, Response } from 'express';
import { ChatMessagesService } from '../services/chat-messages.service';
import { WebSocketService } from '../services/websocket.service';

const logger = LoggerService.getInstance();
const chatService = ChatMessagesService.getInstance();
const wsService = WebSocketService.getInstance();

export class ChatMessagesController {
  async getChatMessages(req: Request, res: Response): Promise<void> {
    logger.info('Incoming query getChatMessages');

    res.json(await chatService.getChatMessages());
  }

  async getChatMessagesByChannelId(req: Request, res: Response): Promise<void> {
    logger.info('Incoming query getChatMessagesByChannelId');

    res.json(await chatService.getChatByChannelId(req.params.id));
  }

  async postChatMessage(req: Request, res: Response): Promise<void> {
    logger.info('Incoming query postChatMessage');

    const msg = await chatService.postChatMessage(req.body);

    if (!(msg as any).errors) {
      wsService.sendWsMessageByChannelId(WebSocketTopic.Chat, msg, req.body.channel);
    }

    res.json(msg);
  }

  async deleteChatMessages(req: Request, res: Response): Promise<void> {
    logger.info('Incoming query deleteChatMessages');

    res.json(await chatService.deleteChatMessages());
  }
}
