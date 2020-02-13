import { Router } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthController } from '../controllers/auth.controller';

export class AuthRoutes {
  static getRoutes(): Router {
    const router = Router();
    const controller = new AuthController();

    router.post('/register', AuthService.optional, controller.register);
    router.post('/login', AuthService.optional, controller.login);
    router.get('/logout', AuthService.optional, controller.logout);
    router.get('/current', AuthService.required, controller.getCurrentUser);

    return router;
  }
}
