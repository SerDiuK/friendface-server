import { Router } from 'express';
import { UsersController } from '../controllers/users.controller';
import { AuthService } from '../services/auth.service';

export class UsersRoutes {
  static getRoutes(): Router {
    const router = Router();
    const controller = new UsersController();

    router.route('/')
      .get(AuthService.required, controller.getUsers);


    router.route('/:id')
      .get(AuthService.required, controller.getUsersByChannel)
      .delete(AuthService.required, controller.deleteUser);

    return router;
  }

}
