import { Schema, Document, model } from 'mongoose';

export interface BoardMessage {
  author: string;
  message: string;
  timestamp: string;
}

export interface BoardMessageDocument extends Document, BoardMessage {
}

const ChatSchema: Schema = new Schema({
  author: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: String, required: true },
});

export default model<BoardMessageDocument>('BoardMessages', ChatSchema);
