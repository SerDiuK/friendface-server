import * as http from 'http';
import { WebSocketController } from './controllers/websocket.controller';
import { LoggerService } from './services/logger.service';

const logger = LoggerService.getInstance();

export class WebSocketServer {

  static init(): void {
    const server = http.createServer();
    const wsController = new WebSocketController();
    const port = process.env.WEBSOCKET_PORT || 3001;

    wsController.handleConnection(server);

    server.listen(port, () => logger.info('Websocket Server Initialised on port: 3001'));
  }
}
