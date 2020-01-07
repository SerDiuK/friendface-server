import morgan from 'morgan';
import express from 'express';

export class MorganConf {

  constructor() {}

  init(): express.RequestHandler {
    if (process.env.ENV !== 'production') {
      return morgan('dev');
    }
  }
}
