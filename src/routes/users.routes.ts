import { Router } from 'express';
import { UsersController } from '../controllers/users.controller';

export class UsersRoutes {
  static getRoutes(): Router {
    const router = Router();
    const controller = new UsersController();

    router.route('/')
      .get(controller.getUsers);


    router.route('/:id')
      .get(controller.getUsersByChannel)
      .delete(controller.deleteUser);

    return router;
  }
}
