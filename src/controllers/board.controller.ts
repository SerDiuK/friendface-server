import { LoggerService } from '../services/logger.service';
import { Request, Response } from 'express';
import { BoardService } from '../services/board.service';

const logger = LoggerService.getInstance();
const boardService = BoardService.getInstance();

export class BoardController {
  async getBoardMessages(req: Request, res: Response): Promise<void> {
    logger.info('Incoming query getBoardMessages');

    res.json(await boardService.getAllMessages());
  }

  async postBoardMessage(req: Request, res: Response): Promise<void> {
    logger.info('Incoming query postBoardMessage');

    res.json(await boardService.postBoardMessage(req.body));
  }
}
