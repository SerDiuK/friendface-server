import { BoardMessage } from './board-message';
import { Channel } from './channel';
import { ChatMessage } from './chat-message';
import { ConnectedUser } from './connected-user';

export interface WebSocketMessage {
  topic: WebSocketTopic;
  data: WebSocketDataType;
}

export enum WebSocketTopic {
  Chat = 'chat',
  Board = 'board',
  Status = 'status',
  Login = 'login',
  UserConnected = 'user connected',
  UserDisconnected = 'user disconnected',
  JoinChannel = 'join channel',
  ChannelCreated = 'channel created',
  ChannelDeleted = 'channel deleted',
}

export type LoginMessageData = Partial<ConnectedUser>;

export type WebSocketDataType =
  | ChatMessage
  | LoginMessageData
  | BoardMessage
  | UserConnectedData
  | UserDisconnectedData
  | JoinChannelData
  | ChannelCreatedData
  | ChannelDeletedData;

export type UserConnectedData = ConnectedUser;

export interface UserDisconnectedData {
  id: string;
}

export type ChannelCreatedData = Channel;

export interface ChannelDeletedData {
  id: string;
}

export interface JoinChannelData {
  id: string;
}
