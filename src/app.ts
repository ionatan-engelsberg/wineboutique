import 'reflect-metadata';
import express from 'express';
import bodyParser from 'body-parser';
import { useExpressServer, useContainer } from 'routing-controllers';
import { Container } from 'typedi';

import { ErrorHandler } from './middlewares/errorHandler.middleware';
import { TrimRequest } from './middlewares/trimRequest.middleware';

// required by routing-controllers
useContainer(Container);

const app = express().use(bodyParser.json());

const routingControllersOptions = {
  cors: true,
  defaultErrorHandler: false,
  // controllers
  middlewares: [ErrorHandler, TrimRequest]
  // Checkers
};

useExpressServer(app, routingControllersOptions);

export default app;
