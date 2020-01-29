import { Router } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthController } from '../controllers/auth.controller';

export class AuthRoutes {
  static getRoutes(): Router {
    const router = Router();
    const controller = new AuthController();

    router.post('/login', AuthService.isOptional, controller.login);

    return router;
  }

}
