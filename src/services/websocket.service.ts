import { Server } from 'http';
import * as WebSocket from 'ws';
import { BoardMessage } from '../models/board-message';
import { ChatMessage } from '../models/chat-message';
import { WebSocketMessage, WebSocketTopic } from '../models/websocket-message';
import { BoardService } from './board.service';
import { ChatService } from './chat.service';
import { LoggerService } from './logger.service';

const logger = LoggerService.getInstance();
const chatService = ChatService.getInstance();
const boardService = BoardService.getInstance();

export class WebSocketService {
  private static instance: WebSocketService;
  private webSocketServer: WebSocket.Server;

  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }

    return WebSocketService.instance;
  }

  initWebSocketServer(server: Server): void {
    this.webSocketServer = new WebSocket.Server({ server });
    this.handleConnection();
  }

  private handleConnection(): void {
    this.webSocketServer.on('connection', (ws: WebSocket) => {
      logger.info('Connection request to Websocket');

      ws.on('message', async (msg: string) => await this.handleMessage(msg));
    });
  }

  private async handleMessage(msg: string): Promise<void> {
    const parsedMsg: WebSocketMessage = JSON.parse(msg);

    switch (parsedMsg.topic) {
      case WebSocketTopic.Chat:
        return await this.handleChatMessage(parsedMsg.data);
      case WebSocketTopic.Status:
        return await this.handleBoardMessage(parsedMsg.data);
      default:
        return;
    }
  }

  private async handleChatMessage(message: ChatMessage): Promise<void> {
    logger.info('handleChatMessage', message);

    const res = await chatService.postMessage(message);

    this.webSocketServer.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        logger.info('Broadcast Chat Message Response', res);
        client.send(JSON.stringify({ topic: WebSocketTopic.Chat, data: res }));
      }
    });
  }

  private async handleBoardMessage(message: BoardMessage ): Promise<void> {
    logger.info('handleBoardMessage', message);

    const res = await boardService.postMessage(message);

    this.webSocketServer.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        logger.info('Board Message Broadcasted', res);
        client.send(JSON.stringify({ topic: WebSocketTopic.Status, data: res }));
      }
    });
  }
}
