import { Server } from 'http';
import * as WebSocket from 'ws';
import { WebSocketExtended, webSocketId } from '../controllers/websocket.controller';
import { WebSocketDataType, WebSocketTopic } from '../models/websocket-message';
import { LoggerService } from './logger.service';

const logger = LoggerService.getInstance();

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
    return {};
  }

  broadcastWsMessage(topic: WebSocketTopic, data: WebSocketDataType): void {
    logger.info('Broadcast Message', topic, data);

    this.webSocketServer.clients.forEach(function each(client: WebSocketExtended) {
      if (client.readyState === WebSocket.OPEN && client.isLoggedIn) {
        client.send(JSON.stringify({topic, data}));
      }
    });
  }

  sendWsMessageByChannelId(topic: WebSocketTopic, data: WebSocketDataType, channelIds: webSocketId[]) {
    logger.info('Send channel Message', topic, data);

    this.webSocketServer.clients.forEach(function each(client: WebSocketExtended) {
      if (client.readyState === WebSocket.OPEN && client.isLoggedIn && channelIds.includes(client.activeChannel)) {
        client.send(JSON.stringify({topic, data}));
      }
    });
  }

  sendWsMessageByUserId(topic: WebSocketTopic, data: WebSocketDataType, userIds: webSocketId[]) {
    logger.info('Send direct Message', topic, data);

    this.webSocketServer.clients.forEach(function each(client: WebSocketExtended) {
      if (client.readyState === WebSocket.OPEN && client.isLoggedIn && userIds.includes(client.activeChannel)) {
        client.send(JSON.stringify({topic, data}));
      }
    });
  }
}
