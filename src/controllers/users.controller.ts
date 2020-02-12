import { UsersService } from '../services/users.service';
import { LoggerService } from '../services/logger.service';
import { Request, Response } from 'express';

const logger = LoggerService.getInstance();
const usersService = UsersService.getInstance();

export class UsersController {
  async getUsers(req: Request, res: Response): Promise<void> {
    logger.info('Incoming query getUsers');

    res.json(await usersService.getUsers());
  }

  async getUsersByChannel(req: Request, res: Response): Promise<void> {
    logger.info('Incoming query getUsersByChannel', req.params.id);

    res.json(await usersService.getUsersByChannel(req.params.id));
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    logger.info('Incoming query deleteUser', req.params.id);

    res.json(await usersService.deleteUser(req.params.id));
  }
}
