import ChannelMessageSchema, { Channel } from '../models/channel';
import { LoggerService } from './logger.service';
import { ChannelType } from '../models/channel';
import { ErrorResponse } from '../utils/service-utils';

const logger = LoggerService.getInstance();

export class ChannelsService {
  private static instance: ChannelsService;

  static getInstance(): ChannelsService {
    if (!ChannelsService.instance) {
      ChannelsService.instance = new ChannelsService();
    }

    return ChannelsService.instance;
  }

  getChannels(type: ChannelType): Promise<Channel[] | ErrorResponse> {
    return ChannelMessageSchema.find({})
      .populate('participants')
      .exec()
      .then(channels => {
        logger.info('getChannels SUCCESS', channels);
        return channels;
      }).catch(error => {
        logger.error('getChannels FAILED', error);
        return { error, status: 400} as ErrorResponse;
      });
  }

  createChannel(body: Channel): Promise<Channel | ErrorResponse> {
    const newChannel = new ChannelMessageSchema({
      ...body
    });

    return newChannel.save().then(channel => {
      logger.info('createChannel SUCCESS', channel);
      return channel;
    }).catch(error => {
      logger.error('createChannel FAILED', error);
      return { error, status: 400 } as ErrorResponse;
    });
  }

  deleteChannel(id): Promise<{ _id: string } | ErrorResponse> {
    return ChannelMessageSchema.findByIdAndDelete(id).then(() => {
      logger.info('deleteChannel SUCCESS');
      return { _id: id };
    }).catch(error => {
      logger.error('deleteChannel FAILED', error);
      return { error, status: 400 };
    });
  }
}
