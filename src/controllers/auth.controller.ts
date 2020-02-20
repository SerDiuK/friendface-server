import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';
import { LoggerService } from '../services/logger.service';
import { ErrorResponse } from '../utils/service-utils';

const logger = LoggerService.getInstance();
const usersService = UsersService.getInstance();

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    logger.info('register request incoming', req.body);

    const user = req.body;

    if (!user.password) {
      res.status(422).json({
        errors: {
          password: 'is required',
        },
      });
    }

    res.json(await usersService.register(user));
  }

  login(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info('login request incoming');

    const user = req.body;

    if (!user.username) {
      res.status(422).json({
        errors: {
          username: 'is required',
        },
      });
    }

    if (!user.password) {
      res.status(422).json({
        errors: {
          password: 'is required',
        },
      });
    }

    return AuthService.authenticate(req, res, next);
  }

  async getCurrentUser(req: Request, res: Response) {
    logger.info('getCurrentUser request incoming');

    const id = (req as any).payload.id;
    const user = await usersService.getAuthUser(id);

    if ((user as ErrorResponse).error) {
      res.status((user as ErrorResponse).status).json((user as ErrorResponse).error);
    } else {
      res.json({ user });
    }
  }

  logout(req: Request, res: Response) {
    logger.info('logout request incoming');

    req.logout();
    res.json({});
  }
}
