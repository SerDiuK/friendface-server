import moment from 'moment';
import ChannelMessageSchema, { Channel } from '../models/channel';
import { LoggerService } from './logger.service';

const logger = LoggerService.getInstance();

export class ChannelsService {
  private static instance: ChannelsService;

  static getInstance(): ChannelsService {
    if (!ChannelsService.instance) {
      ChannelsService.instance = new ChannelsService();
    }

    return ChannelsService.instance;
  }

  getChannels(): Promise<Channel[]> {
    return ChannelMessageSchema.find({})
      .populate('participants')
      .exec()
      .then(channels => {
        logger.info('getChannels SUCCESS', channels);
        return channels;
      }).catch(err => {
        logger.error('getChannels FAILED', err);
        return err;
      });
  }

  createChannel(body: Channel): Promise<Channel> {
    const newChannel = new ChannelMessageSchema({
      ...body
    });

    return newChannel.save().then(channel => {
      logger.info('createChannel SUCCESS', channel);
      return channel;
    }).catch(err => {
      logger.error('createChannel FAILED', err);
      return err;
    });
  }

  deleteChannel(id): Promise<string> {
    return ChannelMessageSchema.findByIdAndDelete(id).then(() => {
      logger.info('deleteChannel SUCCESS');
      return id;
    }).catch(err => {
      logger.error('deleteChannel FAILED', err);
      return err;
    });
  }
}
