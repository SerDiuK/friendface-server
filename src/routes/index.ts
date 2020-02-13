import { Router, Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { ChannelsRoutes } from './channels.routes';
import { ChatMessagesRoutes } from './chat-messages.routes';
import { AuthRoutes } from './auth.routes';
import { UsersRoutes } from './users.routes';

export class ApplicationRoutes {
  static getRoutes(): Router {
    const router = Router();

    router.get('/', (req: Request, res: Response) => {
      res.send('Friendface API');
    });

    router.use('/chat-messages', AuthService.required, ChatMessagesRoutes.getRoutes());
    router.use('/channels', AuthService.required, ChannelsRoutes.getRoutes());
    router.use('/auth', AuthRoutes.getRoutes());
    router.use('/users', AuthService.required, UsersRoutes.getRoutes());

    return router;
  }
}
