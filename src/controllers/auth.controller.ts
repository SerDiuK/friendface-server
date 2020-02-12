import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../services/users.service';
import { LoggerService } from '../services/logger.service';
import passport from 'passport';

const logger = LoggerService.getInstance();
const usersService = UsersService.getInstance();

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    logger.info('Register request incoming');

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
    logger.info('Login request incoming');

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

    return passport.authenticate('local', { session: false }, (err, passportUser) => {

      if (err) {
        return next(err);
      }

      if (passportUser) {
        const ppuser = passportUser;
        ppuser.token = passportUser.generateJWT();

        return res.json({user: ppuser.toAuthJSON()});
      }

      return res.status(400).json({ error: 'Authentication failed' });
    })(req, res, next);
  }
}
