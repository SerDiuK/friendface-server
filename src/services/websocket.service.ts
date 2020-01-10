import { Server } from 'http';
import * as WebSocket from 'ws';
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

  sendMessage(topic: WebSocketTopic, data: WebSocketDataType): void {
    this.webSocketServer.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        logger.info('Broadcast Chat Message Response', data);
        client.send(JSON.stringify({ topic, data }));
      }
    });
  }

}
