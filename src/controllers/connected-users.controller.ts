import { ConnectedUserService } from '../services/connected-user.service';
import { LoggerService } from '../services/logger.service';
import { Request, Response } from 'express';

const logger = LoggerService.getInstance();
const connectedUsersService = ConnectedUserService.getInstance();

export class ConnectedUsersController {
  async getConnectedUsers(req: Request, res: Response): Promise<void> {
    logger.info('Incoming query getConnectedUsers');

    res.json(await connectedUsersService.getConnectedUsers());
  }

  async getConnectedUsersByChannel(req: Request, res: Response): Promise<void> {
    logger.info('Incoming query getConnectedUsersByChannel', req.params.id);

    res.json(await connectedUsersService.getConnectedUsersByChannel(req.params.id));
  }
}
