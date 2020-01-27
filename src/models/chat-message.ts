import { Schema, Document, model } from 'mongoose';

export interface ChatMessage {
  author: string;
  body: string;
  timestamp?: string;
  channel: string;
}

export interface ChatMessageDocument extends Document, ChatMessage {
}

const ChatSchema: Schema = new Schema({
  author: { type: String, required: 'Every message needs an author' },
  body: { type: String, required: 'Every message needs a body' },
  timestamp: { type: String },
  channel: {
    type: Schema.Types.ObjectId,
    ref: 'Channel',
    required: 'Every message needs a channel'
  }
});

export default model<ChatMessageDocument>('ChatMessages', ChatSchema);
