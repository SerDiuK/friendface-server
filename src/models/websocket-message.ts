import { Channel } from './channel';
import { ChatMessage } from './chat-message';
import { User } from './user';

export interface WebSocketMessage {
  topic: WebSocketTopic;
  data: WebSocketDataType;
}

export enum WebSocketTopic {
  Chat = 'chat',
  Board = 'board',
  Login = 'login',
  UserConnected = 'user connected',
  UserDisconnected = 'user disconnected',
  JoinChannel = 'join channel',
  ChannelCreated = 'channel created',
  ChannelDeleted = 'channel deleted',
}

export interface LoginMessageData {
  id: string;
}

export type WebSocketDataType =
  | ChatMessage
  | LoginMessageData
  | UserConnectedData
  | UserDisconnectedData
  | JoinChannelData
  | ChannelCreatedData
  | ChannelDeletedData;

export type UserConnectedData = User;

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
