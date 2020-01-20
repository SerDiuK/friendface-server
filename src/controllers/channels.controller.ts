import { Request, Response } from 'express';
import { WebSocketTopic } from '../models/websocket-message';
import { ChannelsService } from '../services/channels.service';
import { LoggerService } from '../services/logger.service';
import { WebSocketService } from '../services/websocket.service';

const logger = LoggerService.getInstance();
const channelsService = ChannelsService.getInstance();
const wsService = WebSocketService.getInstance();

export class ChannelsController {
  async getChannels(req: Request, res: Response): Promise<void> {
    logger.info('Incoming query getChannels');

    res.json(await channelsService.getChannels());
  }

  async createChannel(req: Request, res: Response): Promise<void> {
    logger.info('Incoming query createChannel');

    const channel = await channelsService.createChannel(req.body);
    wsService.broadcastWsMessage(WebSocketTopic.ChannelCreated, channel);

    res.json(channel);
  }

  async deleteChannel(req: Request, res: Response): Promise<void> {
    logger.info('Incoming query deleteChannel');
    const channelId = req.params.id;

    await channelsService.deleteChannel(channelId);

    wsService.broadcastWsMessage(WebSocketTopic.ChannelDeleted, { id: channelId });
    res.json({});
  }
}
