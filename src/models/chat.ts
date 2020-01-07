import { Schema, Document, model } from 'mongoose';

export interface ChatMessage {
  author: string;
  message: string;
  timestamp: string;
}

export interface ChatMessageDocument extends Document, ChatMessage {
}

const ChatSchema: Schema = new Schema({
  author: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: String, required: true },
});

export default model<ChatMessageDocument>('Chat', ChatSchema);
