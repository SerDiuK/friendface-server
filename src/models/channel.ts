import { Schema, Document, model } from 'mongoose';

export enum ChannelType {
  Group = 'group',
  Direct = 'direct',
}

export interface Channel {
  name: string;
  type: ChannelType;
}

export interface ChannelDocument extends Document, Channel {
}

const ChatSchema: Schema = new Schema({
  name: { type: String, required: 'Every channel needs a name' },
  type: { type: ChannelType, required: 'Every channel needs a type' },
});

export default model<ChannelDocument>('Channel', ChatSchema);
