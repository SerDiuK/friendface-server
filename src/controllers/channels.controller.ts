import { Request, Response } from 'express';
import { WebSocketTopic } from '../models/websocket-message';
import { ChannelsService } from '../services/channels.service';
import { LoggerService } from '../services/logger.service';
import { WebSocketService } from '../services/websocket.service';
import { ErrorResponse } from '../utils/service-utils';
import { Channel } from '../models/channel';

const logger = LoggerService.getInstance();
const channelsService = ChannelsService.getInstance();
const wsService = WebSocketService.getInstance();

export class ChannelsController {
  async getChannels(req: Request, res: Response): Promise<void> {
    logger.info('Incoming query getChannels');

    const channels = await channelsService.getChannels(req.query.type);

    if ((channels as ErrorResponse).error) {
      res.status((channels as ErrorResponse).status).json((channels as ErrorResponse).error);
    } else {
      res.json(channels);
    }
  }

  async createChannel(req: Request, res: Response): Promise<void> {
    logger.info('Incoming query createChannel');

    const channel = await channelsService.createChannel(req.body);

    if ((channel as ErrorResponse).error) {
      res.status((channel as ErrorResponse).status).json((channel as ErrorResponse).error);
    } else {
      wsService.broadcastWsMessage(WebSocketTopic.ChannelCreated, channel as Channel);
      res.json(channel);
    }
  }

  async deleteChannel(req: Request, res: Response): Promise<void> {
    logger.info('Incoming query deleteChannel');
    const channelId = req.params.id;

    const channel = await channelsService.deleteChannel(channelId);

    if ((channel as ErrorResponse).error) {
      res.status((channel as ErrorResponse).status).json((channel as ErrorResponse).error);
    } else {
      wsService.broadcastWsMessage(WebSocketTopic.ChannelDeleted, { id: channelId });
      res.json(channel);
    }
  }
}
