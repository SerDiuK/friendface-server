import { UsersService } from '../services/users.service';
import { LoggerService } from '../services/logger.service';
import { Request, Response } from 'express';
import { ErrorResponse } from '../utils/service-utils';

const logger = LoggerService.getInstance();
const usersService = UsersService.getInstance();

export class UsersController {
  async getUsers(req: Request, res: Response): Promise<void> {
    logger.info('Incoming query getUsers');

    const users = await usersService.getUsers();

    if ((users as ErrorResponse).error) {
      res.status((users as ErrorResponse).status).json((users as ErrorResponse).error);
    } else {
      res.json(users);
    }
  }

  async getUsersByChannel(req: Request, res: Response): Promise<void> {
    logger.info('Incoming query getUsersByChannel', req.params.id);

    const users = await usersService.getUsersByChannel(req.params.id);

    if ((users as ErrorResponse).error) {
      res.status((users as ErrorResponse).status).json((users as ErrorResponse).error);
    } else {
      res.json(users);
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    logger.info('Incoming query deleteUser', req.params.id);

    const user = await usersService.deleteUser(req.params.id);

    if ((user as ErrorResponse).error) {
      res.status((user as ErrorResponse).status).json((user as ErrorResponse).error);
    } else {
      res.json(user);
    }
  }
}
