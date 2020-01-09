import { Server } from 'http';
import { BoardMessage } from '../models/board-message';
import { ChatMessage } from '../models/chat-message';
import { WebSocketMessage, WebSocketTopic } from '../models/websocket-message';
import { BoardService } from '../services/board.service';
import { ChatService } from '../services/chat.service';
import { LoggerService } from '../services/logger.service';
import { WebSocketService } from '../services/websocket.service';

const wsService = WebSocketService.getInstance();
const chatService = ChatService.getInstance();
const boardService = BoardService.getInstance();
const logger = LoggerService.getInstance();

export class WebSocketController {

  constructor() {}


  handleConnection(server: Server): void {
    wsService.initWebSocketServer(server);

    wsService.webSocketServer.on('connection', (ws) => {
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

  private handleChatMessage(message: ChatMessage): void {
    logger.info('handleChatMessage', message);

    chatService.postMessage(message);
  }

  private handleBoardMessage(message: BoardMessage ): void {
    logger.info('handleBoardMessage', message);

    boardService.postMessage(message);
  }

}
