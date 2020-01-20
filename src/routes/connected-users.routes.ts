import { Router } from 'express';
import { ConnectedUsersController } from '../controllers/connected-users.controller';

export class ConnectedUsersRoutes {
  static getRoutes(): Router {
    const router = Router();
    const controller = new ConnectedUsersController();

    router.route('/')
      .get(controller.getConnectedUsers);


    router.route('/:id')
      .get(controller.getConnectedUsersByChannel);

    return router;
  }

}
