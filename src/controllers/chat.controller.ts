import { WebSocketTopic } from '../models/websocket-message';
import { LoggerService } from '../services/logger.service';
import { Request, Response } from 'express';
import { ChatService } from '../services/chat.service';
import { WebSocketService } from '../services/websocket.service';

const logger = LoggerService.getInstance();
const chatService = ChatService.getInstance();
const wsService = WebSocketService.getInstance();

export class ChatController {
  async getAllMessages(req: Request, res: Response): Promise<void> {
    logger.info('Incoming query getAllMessages');

    res.json(await chatService.getAllMessages());
  }

  async postMessage(req: Request, res: Response): Promise<void> {
    logger.info('Incoming query postMessage');

    const msg = await chatService.postMessage(req.body);
    await wsService.sendMessage(WebSocketTopic.Chat, msg);

    res.json(msg);
  }

  async deleteMessages(req: Request, res: Response): Promise<void> {
    logger.info('Incoming query deleteMessages');

    res.json(await chatService.deleteMessages());
  }
}
