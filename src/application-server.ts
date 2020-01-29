import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import { ApplicationRoutes } from './routes';
import * as path from 'path';
import { MorganConf } from './config/morgan.conf';

export class ApplicationServer {
  static async setup(): Promise<express.Express> {
    const app = express();

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(session({ secret: process.env.SESSION_SECRET, cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));

    app.use(new MorganConf().init());
    require('./models/user');
    require('./config/passport.conf');

    app.get('/', (req, res) => {
        res.send('it works :)');
    });

    app.use('/api', ApplicationRoutes.getRoutes());
    app.use('/', express.static(path.join(__dirname, 'public')));

    return app;
  }
}
