import { Router } from 'express';
import { BoardController } from '../controllers/board.controller';

export class BoardRoutes {

  static getRoutes(): Router {
    const router = Router();
    const controller = new BoardController();

    router.route('/')
      .get(controller.getBoardMessages)
      .post(controller.postBoardMessage);

    return router;
  }
}
