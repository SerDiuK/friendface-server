import { Server } from 'http';
import * as WebSocket from 'ws';
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

  initWebSocketServer(server: Server): void {
    this.webSocketServer = new WebSocket.Server({ server });
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
