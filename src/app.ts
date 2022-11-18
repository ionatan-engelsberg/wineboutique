import 'reflect-metadata';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { useExpressServer, useContainer } from 'routing-controllers';
import { Container } from 'typedi';

import { controllers } from './controllers';
import { ErrorHandler } from './middlewares/errorHandler.middleware';
import { TrimRequest } from './middlewares/trimRequest.middleware';

import { COOKIE_SIGNATURE } from './config/config';

// required by routing-controllers
useContainer(Container);

const app = express().use(bodyParser.json());

app.use(cookieParser(COOKIE_SIGNATURE));

const routingControllersOptions = {
  cors: true,
  defaultErrorHandler: false,
  controllers,
  middlewares: [ErrorHandler, TrimRequest]
  // Checkers
};

useExpressServer(app, routingControllersOptions);

export default app;
