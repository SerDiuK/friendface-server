import { Router, Request, Response } from 'express';
import { ChannelsRoutes } from './channels.routes';
import { ChatMessagesRoutes } from './chat-messages.routes';
import { BoardRoutes } from './board.routes';
import { ConnectedUsersRoutes } from './connected-users.routes';
import { AuthRoutes } from './auth.routes';
import { UsersRoutes } from './users.routes';

export class ApplicationRoutes {
  static getRoutes(): Router {
    const router = Router();

    router.get('/', (req: Request, res: Response) => {
      res.send('Friendface API');
    });

    router.use('/chat-messages', ChatMessagesRoutes.getRoutes());
    router.use('/channels', ChannelsRoutes.getRoutes());
    router.use('/board', BoardRoutes.getRoutes());
    router.use('/connected-users', ConnectedUsersRoutes.getRoutes());
    router.use('/auth', AuthRoutes.getRoutes());
    router.use('/users', UsersRoutes.getRoutes());

    return router;
  }
}
