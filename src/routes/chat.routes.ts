import { Router } from 'express';
import { ChatController } from '../controllers/chat.controller';

export class ChatRoutes {
  static getRoutes(): Router {
    const router = Router();
    const controller = new ChatController();

    router.route('/')
      .get(controller.getAllMessages)
      .post(controller.postMessage)
      .delete(controller.deleteMessages);

    return router;
  }
}
