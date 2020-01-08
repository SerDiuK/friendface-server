import * as http from 'http';
import { LoggerService } from './services/logger.service';
import { WebSocketService } from './services/websocket.service';

const logger = LoggerService.getInstance();
const wsService = WebSocketService.getInstance();

export class WebSocketServer {

  static init(): void {
    const server = http.createServer();

    wsService.initWebSocketServer(server);

    server.listen(3001, () => logger.info('Websocket Server Initialised on port: 3001'));
  }
}
