import { LoggerService } from '../services/logger.service';
import { Request, Response } from 'express';
import { ChatService } from '../services/chat.service';

const logger = LoggerService.getInstance();
const chatService = ChatService.getInstance();

export class ChatController {
  async getAllMessages(req: Request, res: Response): Promise<void> {
    logger.info('Incoming query getAllMessages');

    res.json(await chatService.getAllMessages());
  }

  async postMessage(req: Request, res: Response): Promise<void> {
    logger.info('Incoming query postMessage');

    res.json(await chatService.postMessage(req.body));
  }

  async deleteMessages(req: Request, res: Response): Promise<void> {
    logger.info('Incoming query deleteMessages');

    res.json(await chatService.deleteMessages());
  }
}
