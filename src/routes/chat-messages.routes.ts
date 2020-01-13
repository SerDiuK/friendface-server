import { Router } from 'express';
import { ChatMessagesController } from '../controllers/chat-messages.controller';

export class ChatMessagesRoutes {
  static getRoutes(): Router {
    const router = Router();
    const controller = new ChatMessagesController();

    router.route('/')
      .get(controller.getChatMessages)
      .post(controller.postChatMessage)
      .delete(controller.deleteChatMessages);

    return router;
  }
}
