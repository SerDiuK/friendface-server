import { Schema, Document, model } from 'mongoose';

export interface ConnectedUser {
  name: string;
  webSocketSessionId: string;
  channel: string;
}

export interface ConnectedUserDocument extends Document, ConnectedUser {
}

const ConnectedUserSchema: Schema = new Schema({
  name: { type: String, required: true },
  webSocketSessionId: { type: String, required: true },
  channel: {
    type: Schema.Types.ObjectId,
    ref: 'Channel',
  }
});

export default model<ConnectedUserDocument>('ConnectedUser', ConnectedUserSchema);
