import { Server } from 'http';
import uuid from 'uuid/v1';
import * as WebSocket from 'ws';
import { BoardMessage } from '../models/board-message';
import { ChatMessage } from '../models/chat-message';
import { JoinChannelData, LoginMessageData, WebSocketMessage, WebSocketTopic } from '../models/websocket-message';
import { BoardService } from '../services/board.service';
import { ChatMessagesService } from '../services/chat-messages.service';
import { ConnectedUserService } from '../services/connected-user.service';
import { LoggerService } from '../services/logger.service';
import { WebSocketService } from '../services/websocket.service';

const wsService = WebSocketService.getInstance();
const chatService = ChatMessagesService.getInstance();
const boardService = BoardService.getInstance();
const connectedUserService = ConnectedUserService.getInstance();
const logger = LoggerService.getInstance();

export type webSocketId = string;

export interface WebSocketExtended extends WebSocket {
  id: webSocketId;
  isLoggedIn: boolean;
  activeChannel: string;
}

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
  id: webSocketId;
  activeChannel: string;

  constructor(private ws: WebSocketExtended) {
    this.id = uuid();

    logger.info('Connection made to Websocket', this.id);

    ws.on('close', () => this.handleConnectionClosed());
    ws.on('message', async (msg: string) => await this.handleMessage(msg));
    ws.id = this.id;
  }

  private async handleMessage(msg: string): Promise<void> {
    const parsedMsg: WebSocketMessage = JSON.parse(msg);

    logger.info('Incoming message', parsedMsg);

    switch (parsedMsg.topic) {
      case WebSocketTopic.Chat:
        return await this.handleChatMessage(parsedMsg.data as ChatMessage);
      case WebSocketTopic.Status:
        return await this.handleBoardMessage(parsedMsg.data as BoardMessage);
      case WebSocketTopic.Login:
        return await this.handleLoginMessage(parsedMsg.data as LoginMessageData);
      case WebSocketTopic.JoinChannel:
        return await this.handleJoinChannel(parsedMsg.data as JoinChannelData);
      default:
        return;
    }
  }

  private async handleChatMessage(data: ChatMessage): Promise<void> {
    logger.info('handleChatMessage', data);

    const chatMessageData = await chatService.postChatMessage(data);
    wsService.broadcastWsMessage(WebSocketTopic.Chat, chatMessageData);
  }

  private async handleBoardMessage(data: BoardMessage ): Promise<void> {
    logger.info('handleBoardMessage', data);

    const boardMessageData = await boardService.postBoardMessage(data);
    wsService.broadcastWsMessage(WebSocketTopic.Board, boardMessageData);
  }

  private async handleLoginMessage(data: LoginMessageData): Promise<void> {
    logger.info('handleLoginMessage', data);
    const newUser = await connectedUserService.addConnectedUser({
      name: data.name,
      webSocketSessionId: this.id,
      channel: '5e1c6857feca18b5358f6913'
    });

    this.activeChannel = '5e1c6857feca18b5358f6913';
    this.ws.activeChannel = '5e1c6857feca18b5358f6913';
    this.ws.isLoggedIn = true;

    wsService.sendWsMessageByChannelId(WebSocketTopic.UserConnected, newUser as LoginMessageData, ['5e1c6857feca18b5358f6913']);
  }

  private async handleJoinChannel(data: JoinChannelData): Promise<void> {
    logger.info('handleJoinChannel', data);

    this.activeChannel = data.id;
    this.ws.activeChannel = data.id;

    const connectedUser = await connectedUserService.updateChannel(this.id, this.activeChannel);
    wsService.sendWsMessageByChannelId(WebSocketTopic.UserConnected, connectedUser, [this.activeChannel]);
  }

  private async handleConnectionClosed(): Promise<void> {
    logger.info('Connection Closed', this.id);

    const deletedUserId = await connectedUserService.removeConnectedUser(this.id);
    wsService.broadcastWsMessage(WebSocketTopic.UserDisconnected, { id: deletedUserId } as LoginMessageData);
  }
}
