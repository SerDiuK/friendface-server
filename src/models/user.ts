import { Schema, Document, model } from 'mongoose';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export interface User {
  name: string;
  webSocketSessionId: string;
  activeChannel: string;
  channelSubscriptions: string[];
  hash: string;
  salt: string;
  email: string;
}

export interface UserDocument extends Document, User {
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  hash: String,
  salt: String,
  email: String,
  webSocketSessionId: { type: String, required: true },
  activeChannel: {
    type: Schema.Types.ObjectId,
    ref: 'Channel',
  },
  channelSubscriptions: [{
    type: Schema.Types.ObjectId,
    ref: 'Channel',
  }]
});

UserSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.validatePassword = function(password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

UserSchema.methods.generateJWT = function() {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  return jwt.sign({
    email: this.email,
    id: this._id,
    exp: expirationDate.getTime(),
  }, process.env.SESSION_SECRET);
};

UserSchema.methods.toAuthJSON = function() {
  return {
    _id: this._id,
    email: this.email,
    token: this.generateJWT(),
  };
};

export default model<UserDocument>('User', UserSchema);
