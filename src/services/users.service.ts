import UserSchema, { User, UserDocument } from '../models/user';
import { LoggerService } from './logger.service';
import { ErrorResponse } from '../utils/service-utils';
import { AuthUser } from '../models/user';

const logger = LoggerService.getInstance();

export class UsersService {
  private static instance: UsersService;

  static getInstance(): UsersService {
    if (!UsersService.instance) {
      UsersService.instance = new UsersService();
    }

    return UsersService.instance;
  }

  register(body): Promise<AuthUser | ErrorResponse> {
    const newUser = new UserSchema(body);

    newUser.setPassword(body.password);

    return newUser.save().then(user => {
      logger.info('register SUCCESS', user);
      return user.toAuthJSON();
    }).catch(error => {
      logger.error('register FAILED', error);
      return { error, status: 400 } as ErrorResponse;
    });
  }

  getAuthUser(id: string): Promise<AuthUser | ErrorResponse> {
    return UserSchema.findById(id, 'username email')
      .then((user) => {
        logger.info('getCurrentUser SUCCESS', user);
        return user.toAuthJSON();
      }).catch(error => {
        logger.error('getCurrentUser FAILED', error);
        return { error, status: 400} as ErrorResponse;
      });
  }

  getUsers(): Promise<User[] | ErrorResponse> {
    return UserSchema.find({}, 'username channel').then((users) => {
      logger.info('getUsers SUCCESS', users);
      return users;
    }).catch(error => {
      logger.error('getUsers FAILED', error);
      return { error, status: 400 } as ErrorResponse;
    });
  }

  getUsersByChannel(channel: string): Promise<User[] | ErrorResponse> {
    return UserSchema.find({ channel }, 'username').then((users) => {
      logger.info('getUsersByChannel SUCCESS', users);
      return users;
    }).catch(error => {
      logger.error('getUsersByChannel FAILED', error);
      return { error, status: 400 } as ErrorResponse;
    });
  }

  deleteUser(id: string): Promise<{ _id: string } | ErrorResponse> {
    return UserSchema.findByIdAndDelete(id).then(user => {
      logger.info('deleteUser SUCCESS', user);
      return { _id: user._id };
    }).catch(error => {
      logger.error('deleteUser FAILED', error);
      return { error, status: 400 } as ErrorResponse;
    });
  }

  userConnected(id: string): Promise<User | ErrorResponse> {
    return UserSchema.findByIdAndUpdate(id, { isConnected: true }).then(user => {
      logger.info('userConnected SUCCESS', user);
      return user;
    }).catch(error => {
      logger.error('userConnected FAILED', error);
      return { error, status: 400 };
    });
  }

  userDisconnected(id: string): Promise<User | ErrorResponse> {
    return UserSchema.findByIdAndUpdate(id, { isConnected: false }).then(user => {
      logger.info('userConnected SUCCESS', user);
      return user;
    }).catch(error => {
      logger.error('userConnected FAILED', error);
      return { error, status: 400 } as ErrorResponse;
    });
  }
}
