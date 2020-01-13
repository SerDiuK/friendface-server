import { ChannelsService } from '../services/channels.service';
import { LoggerService } from '../services/logger.service';
import { Request, Response } from 'express';
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

    const msg = await channelsService.createChannel(req.body);

    res.json(msg);
  }

  async deleteChannel(req: Request, res: Response): Promise<void> {
    logger.info('Incoming query deleteChannel');

    res.json(await channelsService.deleteChannel(req.params.id));
  }
}
