import { Server } from 'http';
import uuid from 'uuid/v1';
import * as WebSocket from 'ws';
import { ChatMessage } from '../models/chat-message';
import { JoinChannelData, LoginMessageData, WebSocketMessage, WebSocketTopic } from '../models/websocket-message';
import { ChatMessagesService } from '../services/chat-messages.service';
import { LoggerService } from '../services/logger.service';
import { UsersService } from '../services/users.service';
import { WebSocketService } from '../services/websocket.service';

const wsService = WebSocketService.getInstance();
const chatService = ChatMessagesService.getInstance();
const usersService = UsersService.getInstance();
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
  name: string;
  userId: string;

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

    const chatMessageData = await chatService.postChatMessage({
      body: data.body,
      author: this.name,
      channel: this.activeChannel
    });

    if (!(chatMessageData as any).errors) {
      wsService.sendWsMessageByChannelId(WebSocketTopic.Chat, chatMessageData, [this.activeChannel]);
    }
  }

  private async handleLoginMessage(data: LoginMessageData): Promise<void> {
    logger.info('handleLoginMessage', data);

    this.userId = data.id;
    this.activeChannel = '5e1c6857feca18b5358f6913';
    this.ws.activeChannel = '5e1c6857feca18b5358f6913';
    this.ws.isLoggedIn = true;

    wsService.sendWsMessageByChannelId(WebSocketTopic.UserConnected, await usersService.getUser(data.id), ['5e1c6857feca18b5358f6913']);
  }

  private async handleJoinChannel(data: JoinChannelData): Promise<void> {
    logger.info('handleJoinChannel', data);

    this.activeChannel = data.id;
    this.ws.activeChannel = data.id;

    const user = await usersService.userConnected(this.userId);

    wsService.sendWsMessageByChannelId(WebSocketTopic.UserConnected, user, [this.activeChannel]);
  }

  private async handleConnectionClosed(): Promise<void> {
    logger.info('Connection Closed', this.id);

    await usersService.userDisconnected(this.userId);

    wsService.broadcastWsMessage(WebSocketTopic.UserDisconnected, { id: this.userId } as LoginMessageData);
  }
}
