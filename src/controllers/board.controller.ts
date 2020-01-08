import { LoggerService } from '../services/logger.service';
import { Request, Response } from 'express';
import { BoardService } from '../services/board.service';

const logger = LoggerService.getInstance();
const statusService = BoardService.getInstance();

export class BoardController {
  async getAllMessages(req: Request, res: Response): Promise<void> {
    logger.info('Incoming query getAllStatuses');

    res.json(await statusService.getAllMessages());
  }

  async postMessage(req: Request, res: Response): Promise<void> {
    logger.info('Incoming query postStatus');

    res.json(await statusService.postMessage(req.body));
  }
}
