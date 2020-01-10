import { WebSocketTopic } from '../models/websocket-message';
import { LoggerService } from '../services/logger.service';
import { Request, Response } from 'express';
import { ChatService } from '../services/chat.service';
import { WebSocketService } from '../services/websocket.service';

const logger = LoggerService.getInstance();
const chatService = ChatService.getInstance();
const wsService = WebSocketService.getInstance();

export class ChatController {
  async getChatMessages(req: Request, res: Response): Promise<void> {
    logger.info('Incoming query getChatMessages');

    res.json(await chatService.getChatMessages());
  }

  async postChatMessage(req: Request, res: Response): Promise<void> {
    logger.info('Incoming query postChatMessage');

    const msg = await chatService.postChatMessage(req.body);
    await wsService.sendMessage(WebSocketTopic.Chat, msg);

    res.json(msg);
  }

  async deleteChatMessages(req: Request, res: Response): Promise<void> {
    logger.info('Incoming query deleteChatMessages');

    res.json(await chatService.deleteChatMessages());
  }
}
