import UserSchema, { User, UserDocument } from '../models/user';
import { LoggerService } from './logger.service';

const logger = LoggerService.getInstance();

export class UsersService {
  private static instance: UsersService;

  static getInstance(): UsersService {
    if (!UsersService.instance) {
      UsersService.instance = new UsersService();
    }

    return UsersService.instance;
  }

  register(body): Promise<User> {
    const newUser = new UserSchema(body);

    newUser.setPassword(body.password);

    return newUser.save().then(user => {
      logger.info('register SUCCESS', user);
      return { _id: user._id };
    }).catch(err => {
      logger.error('register FAILED', err);
      return err;
    });
  }

  getUser(id: string): Promise<UserDocument> {
    return UserSchema.findById(id, 'username email')
      .then((user) => {
        logger.info('getCurrentUser SUCCESS', user);
        return user;
      }).catch(err => {
        logger.error('getCurrentUser FAILED', err);
        return err;
      });
  }

  getUsers(): Promise<User[]> {
    return UserSchema.find({}, 'username channel').then((users) => {
      logger.info('getUsers SUCCESS', users);
      return users;
    }).catch(err => {
      logger.error('getUsers FAILED', err);
      return err;
    });
  }

  getUsersByChannel(channel: string): Promise<User[]> {
    return UserSchema.find({ channel }, 'username').then((users) => {
      logger.info('getUsersByChannel SUCCESS', users);
      return users;
    }).catch(err => {
      logger.error('getUsersByChannel FAILED', err);
      return err;
    });
  }

  deleteUser(id: string): Promise<User> {
    return UserSchema.findByIdAndDelete(id).then(user => {
      logger.info('deleteUser SUCCESS', user);
      return user._id;
    }).catch(err => {
      logger.error('deleteUser FAILED', err);
      return err;
    });
  }

  userConnected(id: string): Promise<User> {
    return UserSchema.findByIdAndUpdate(id, { isConnected: true }).then(user => {
      logger.info('userConnected SUCCESS', user);
      return user;
    }).catch(err => {
      logger.error('userConnected FAILED', err);
      return err;
    });
  }

  userDisconnected(id: string): Promise<User> {
    return UserSchema.findByIdAndUpdate(id, { isConnected: false }).then(user => {
      logger.info('userConnected SUCCESS', user);
    }).catch(err => {
      logger.error('userConnected FAILED', err);
      return err;
    });
  }
}
