import { ChatMessage } from './chat-message';

export interface WebSocketMessage {
  topic: WebSocketTopic;
  data: ChatMessage;
}

export enum WebSocketTopic {
  Chat = 'chat',
  Status = 'status'
}
