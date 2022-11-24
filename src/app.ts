import 'reflect-metadata';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { useExpressServer, useContainer } from 'routing-controllers';
import { Container } from 'typedi';

import { WEB_URL } from './config/config';
import { controllers } from './controllers';
import { ErrorHandler } from './middlewares/errorHandler.middleware';
import { TrimRequest } from './middlewares/trimRequest.middleware';
import { DecodeUser } from './middlewares/decodeUser.middleware';

import { AuthorizationCheckerService } from './services/auth.checker.service';

import { COOKIE_SIGNATURE } from './config/config';

// required by routing-controllers
useContainer(Container);

const app = express().use(bodyParser.json());

app.use(cookieParser(COOKIE_SIGNATURE));

const routingControllersOptions = {
  cors: {
    origin: WEB_URL,
    credentials: true,
    preflightContinue: true
  },
  defaultErrorHandler: false,
  controllers,
  middlewares: [ErrorHandler, TrimRequest, DecodeUser],
  authorizationChecker: AuthorizationCheckerService.getInstance().authorizationChecker,
  currentUserChecker: AuthorizationCheckerService.getInstance().currentUserChecker
};

useExpressServer(app, routingControllersOptions);

export default app;
