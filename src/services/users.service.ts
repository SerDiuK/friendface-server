import UserSchema, { User } from '../models/user';
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

  register(user): Promise<User> {
    const newUser = new UserSchema(user);

    newUser.setPassword(user.password);

    return newUser.save().then(msg => {
      logger.info('register SUCCESS', msg);
      return msg;
    }).catch(err => {
      logger.error('register FAILED', err);
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
    return UserSchema.findOneAndDelete({ _id: id }).then(user => {
      logger.info('deleteUser SUCCESS', user);
      return user._id;
    }).catch(err => {
      logger.error('deleteUser FAILED', err);
      return err;
    });
  }
}
