import { Server } from 'http';
import { BoardMessage } from '../models/board-message';
import { ChatMessage } from '../models/chat-message';
import { LoginMessageData, WebSocketMessage, WebSocketTopic } from '../models/websocket-message';
import { BoardService } from '../services/board.service';
import { ChatMessagesService } from '../services/chat-messages.service';
import { ConnectedUserService } from '../services/connected-user.service';
import { LoggerService } from '../services/logger.service';
import { WebSocketService } from '../services/websocket.service';
import * as WebSocket from 'ws';
import uuid from 'uuid/v1';

const wsService = WebSocketService.getInstance();
const chatService = ChatMessagesService.getInstance();
const boardService = BoardService.getInstance();
const connectedUserService = ConnectedUserService.getInstance();
const logger = LoggerService.getInstance();

export class WebSocketController {

  constructor() {}

  async handleConnection(server: Server): Promise<void> {
    await wsService.initWebSocketServer(server);

    wsService.webSocketServer.on('connection', (ws: any) => {
      const connection = new WebSocketConnection(ws);
    });
  }
}

export class WebSocketConnection {
  id: string;

  constructor(private ws: WebSocket) {
    this.id = uuid();

    logger.info('Connection made to Websocket', this.id);

    ws.on('close', () => this.handleConnectionClosed());
    ws.on('message', async (msg: string) => await this.handleMessage(msg));
  }

  private async handleMessage(msg: string): Promise<void> {
    const parsedMsg: WebSocketMessage = JSON.parse(msg);

    logger.info('Incoming message', msg);

    switch (parsedMsg.topic) {
      case WebSocketTopic.Chat:
        return await this.handleChatMessage(parsedMsg.data as ChatMessage);
      case WebSocketTopic.Status:
        return await this.handleBoardMessage(parsedMsg.data as BoardMessage);
      case WebSocketTopic.Login:
        return await this.handleLoginMessage(parsedMsg.data as LoginMessageData);
      default:
        return;
    }
  }

  private handleChatMessage(data: ChatMessage): void {
    logger.info('handleChatMessage', data);

    chatService.postChatMessage(data);
  }

  private handleBoardMessage(data: BoardMessage ): void {
    logger.info('handleBoardMessage', data);

    boardService.postBoardMessage(data);
  }

  private async handleLoginMessage(data: LoginMessageData): Promise<void> {
    logger.info('handleLoginMessage', data);
    const newUser = await connectedUserService.addConnectedUser({
      name: data.name,
      webSocketSessionId: this.id
    });

    wsService.sendMessage(WebSocketTopic.UserConnected, newUser as LoginMessageData);
  }

  private async handleConnectionClosed(): Promise<void> {
    logger.info('Connection Closed', this.id);

    const deletedUserId = await connectedUserService.removeConnectedUser(this.id);
    wsService.sendMessage(WebSocketTopic.UserDisconnected, { id: deletedUserId } as LoginMessageData);
  }
}
