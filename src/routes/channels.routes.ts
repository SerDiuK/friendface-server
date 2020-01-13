import { Router } from 'express';
import { ChannelsController } from '../controllers/channels.controller';

export class ChannelsRoutes {
  static getRoutes(): Router {
    const router = Router();
    const controller = new ChannelsController();

    router.route('/')
      .get(controller.getChannels)
      .post(controller.createChannel);

    router.route('/:id')
      .delete(controller.deleteChannel);

    return router;
  }
}
