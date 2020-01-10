import { ConnectedUserService } from '../services/connected-user.service';
import { LoggerService } from '../services/logger.service';
import { Request, Response } from 'express';

const logger = LoggerService.getInstance();
const connectedUsersService = ConnectedUserService.getInstance();

export class ConnectedUsersController {
  async getConnectedUsers(req: Request, res: Response): Promise<void> {
    logger.info('Incoming query getBoardMessages');

    res.json(await connectedUsersService.getConnectedUsers());
  }
}
