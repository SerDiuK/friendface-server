import { Schema, Document, model } from 'mongoose';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export interface User {
  username: string;
  activeChannel: string;
  channelSubscriptions: string[];
  hash: string;
  salt: string;
  email: string;
  isConnected: boolean;
}

export interface AuthUser {
  _id: string;
  username: string;
  token: string;
}

export interface UserDocument extends Document, User {
  setPassword(password: string): void;
  validatePassword(password): string;
  generateJWT(): string;
  toAuthJSON(): AuthUser;
}

const UserSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    dropDups: true
  },
  hash: String,
  salt: String,
  email: {
    type: String,
    required: true,
    unique: true,
    dropDups: true
  },
  activeChannel: {
    type: Schema.Types.ObjectId,
    ref: 'Channel',
  },
  isConnected: Boolean,
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
    username: this.username,
    id: this._id,
    exp: expirationDate.getTime(),
  }, process.env.SESSION_SECRET);
};

UserSchema.methods.toAuthJSON = function(): AuthUser {
  return {
    _id: this._id,
    username: this.username,
    token: this.generateJWT(),
  };
};

export default model<UserDocument>('User', UserSchema);
