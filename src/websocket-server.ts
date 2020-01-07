import * as WebSocket from 'ws';
import * as http from 'http';
import { LoggerService } from './services/logger.service';
import { ChatMessage } from './models/chat';
import { ChatService } from './services/chat.service';

const logger = LoggerService.getInstance();
const chatService = ChatService.getInstance();

export class WebsocketServer {

  static init(): void {
    const server = http.createServer();
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws: WebSocket) => {
      logger.info('Connection request to Websocket');

      ws.on('message', async (msg: string) => {
        const parsedMsg: ChatMessage = JSON.parse(msg);

        await chatService.postMessage(parsedMsg);

        wss.clients.forEach(function each(client) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(parsedMsg.message);
          }
        });
      });
    });

    server.listen(3001, () => logger.info('Websocket Server Initialised on port: 3001'));
  }
}
