import 'reflect-metadata';
import { connect } from 'mongoose';

import { PORT, MONGODB_URI } from './config/config';

import app from './app';

connect(MONGODB_URI)
  .then(() => {
    console.log(`Listening on port ${PORT}`);
    app.listen(PORT);
  })
  .catch((err: any) => {
    console.log('An error has ocurred while connecting to database: ', err);
  });
