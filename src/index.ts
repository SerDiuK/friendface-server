import { Application } from './application';
import { LoggerService } from './services/logger.service';
import dotenv from 'dotenv';
import { WebsocketServer } from './websocket-server';
const logger = LoggerService.getInstance();

dotenv.config();
const port = process.env.PORT || 3000;

Application.createApplication().then(app => app.listen(port, () => {
  logger.info('Application running on port: ' + port);
  WebsocketServer.init();
}));

