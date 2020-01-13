import { Schema, Document, model } from 'mongoose';

export interface Channel {
  name: string;
  participants: string[];
}

export interface ChannelDocument extends Document, Channel {
}

const ChatSchema: Schema = new Schema({
  name: { type: String, required: 'Every channel needs a name' },
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'ConnectedUser',
  }],
});

export default model<ChannelDocument>('Channel', ChatSchema);
