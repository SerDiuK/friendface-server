import ConnectedUserSchema, { ConnectedUser } from '../models/connected-user.service';
import { LoggerService } from './logger.service';

const logger = LoggerService.getInstance();

export class ConnectedUserService {
  private static instance: ConnectedUserService;

  static getInstance(): ConnectedUserService {
    if (!ConnectedUserService.instance) {
      ConnectedUserService.instance = new ConnectedUserService();
    }

    return ConnectedUserService.instance;
  }

  getConnectedUsers(): Promise<ConnectedUser[]> {
    return ConnectedUserSchema.find({}).then((users) => {
      logger.info('getConnectedUsers SUCCESS', users);
      return users;
    }).catch(err => {
      logger.error('getConnectedUsers FAILED', err);
      return err;
    });
  }

  addConnectedUser(user: ConnectedUser): Promise<ConnectedUser[]> {
    const newUser = new ConnectedUserSchema(user);

    return newUser.save().then(msg => {
      logger.info('addConnectedUser SUCCESS', msg);
      return msg;
    }).catch(err => {
      logger.error('addConnectedUser FAILED', err);
      return err;
    });
  }

  removeConnectedUser(webSocketSessionId: string): Promise<ConnectedUser> {
    return ConnectedUserSchema.findOneAndDelete({ webSocketSessionId }).then(user => {
      logger.info('removeConnectedUser SUCCESS', user);
      return {};
    }).catch(err => {
      logger.error('removeConnectedUser FAILED', err);
      return err;
    });
  }

  clearConnectedUsers(): Promise<{}> {
    return ConnectedUserSchema.deleteMany({}).then(() => {
      logger.info('clearConnectedUsers SUCCESS');
      return {};
    }).catch(err => {
      logger.error('clearConnectedUsers FAILED', err);
      return err;
    });
  }
}
