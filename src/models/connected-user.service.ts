import { Schema, Document, model } from 'mongoose';

export interface ConnectedUser {
  name: string;
  webSocketSessionId: string;
}

export interface ConnectedUserDocument extends Document, ConnectedUser {
}

const ConnectedUserSchema: Schema = new Schema({
  name: { type: String, required: true },
  webSocketSessionId: { type: String, required: true }
});

export default model<ConnectedUserDocument>('ConnectedUser', ConnectedUserSchema);
