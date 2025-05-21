import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import rateLimiter from 'express-rate-limit';
import sanitizeNosqlQuery from 'express-mongo-sanitize';
import preventCrossSiteScripting from 'xss-clean';
import preventParameterPollution from 'hpp';
import requestIp from 'request-ip';
import { UAParser } from 'ua-parser-js';
import morgan from 'morgan';
import errorHandler from './errors/errorHandler';
import { NotFoundException } from './errors/exceptions/notFound';
import { config } from './config/env';

import { BadRequestException } from './errors/exceptions/badRequest';
import { logRequestAtStart, logRequest } from './middlewares/requestLogs';
import en from './locale/en';



const app = express();

const whitelist = config.security.NO_CORS
  ? '*'
  : config.security.WHITELIST
    ? config.security.WHITELIST.split(',')
    : [];

let options = {
  origin: whitelist,
  credentials: true,
};

app.enable('trust proxy');
app.use(cors(options));

app.use((req, res, next) => {
  const client_ip = requestIp.getClientIp(req);
  if (client_ip) {
    req.headers['x-real-ip'] = client_ip;
  }
  next();
});
if (config.env !== 'test') {
  app.use(morgan('common'));
}

app.use(helmet());
app.use(
  '/',
  rateLimiter({
    max: 1000,
    windowMs: 1000 * 60 * 15,
    message: en['24-hrs-ip-rate-limit'],
    legacyHeaders: false,
  }),
);

app.use(express.json({ limit: '20kb' }));
app.use(cookieParser());


app.use(sanitizeNosqlQuery());
app.use(preventCrossSiteScripting())
app.use(preventParameterPollution());

app.use(compression());

app.use(function (req, res, next) {
  res.on('finish', function () {
    logRequest(req, res);
  });
  next();
});

app.use((req: any, res, next) => {
  const parser = new UAParser();
  const ua = req.headers['user-agent'] || '';
  const device_info = parser.setUA(ua).getResult();

  const device_type = device_info.device.type || 'Desktop';
  const browser = device_info.browser.name || device_info.ua;
  const os_name = device_info.os.name;
  const os_version = device_info.os.version;

  req.device = `Device: ${device_type}, OS: ${os_name} ${os_version}, Browser: ${browser}`;

  next();
});


const baseRoute = '/api/v1';


app.get(baseRoute + '/health', (req, res) => {
  res.send('OK');
});

app.use(logRequestAtStart);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  return next();
});

app.use((req, res, next) => {
  next(new NotFoundException(en['page-not-found']));
});

app.use((err: Error & { type?: string }, req: Request, res: Response, next: NextFunction) => {
  if (err.type === 'entity.too.large') {
    return next(new BadRequestException(en['request-body-too-large'], 413));
  }
  next(err);
});

app.use(errorHandler);

export { app }
