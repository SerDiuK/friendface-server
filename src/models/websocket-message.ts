import { BoardMessage } from './board-message';
import { ChatMessage } from './chat-message';
import { ConnectedUser } from './connected-user.service';

export interface WebSocketMessage {
  topic: WebSocketTopic;
  data: WebSocketDataType;
}

export enum WebSocketTopic {
  Chat = 'chat',
  Status = 'status',
  Login = 'login',
}

export type LoginMessageData = Partial<ConnectedUser>;

export type WebSocketDataType = ChatMessage | LoginMessageData | BoardMessage;
