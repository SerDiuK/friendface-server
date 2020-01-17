import { Server } from 'http';
import * as WebSocket from 'ws';
import { WebSocketExtended, webSocketId } from '../controllers/websocket.controller';
import { WebSocketDataType, WebSocketTopic } from '../models/websocket-message';
import { ConnectedUserService } from './connected-user.service';
import { LoggerService } from './logger.service';

const logger = LoggerService.getInstance();
const connectedUserService = ConnectedUserService.getInstance();

export class WebSocketService {
  private static instance: WebSocketService;

  webSocketServer: WebSocket.Server;

  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }

    return WebSocketService.instance;
  }

  async initWebSocketServer(server: Server): Promise<{}> {
    this.webSocketServer = new WebSocket.Server({ server });
    return connectedUserService.clearConnectedUsers();
  }

  broadcastMessage(topic: WebSocketTopic, data: WebSocketDataType): void {
    this.webSocketServer.clients.forEach(function each(client: WebSocketExtended) {
      if (client.readyState === WebSocket.OPEN && client.isLoggedIn) {
        logger.info('Broadcast Message', topic, data);
        client.send(JSON.stringify({topic, data}));
      }
    });
  }

  sendTargettedMessage(topic: WebSocketTopic, data: WebSocketDataType, target: webSocketId[]) {
    this.webSocketServer.clients.forEach(function each(client: WebSocketExtended) {
      if (client.readyState === WebSocket.OPEN && client.isLoggedIn && target.includes(client.id)) {
        logger.info('Send targetted Message', topic, data);
        client.send(JSON.stringify({topic, data}));
      }
    });

  }
}
