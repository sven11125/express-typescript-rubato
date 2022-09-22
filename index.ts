import { logger } from './src/utils/logger';
import * as express from 'express';
import routes from './src/routes/routes';
import * as cors from 'cors';
import { initMongo } from './src/utils/helpers-mongo'
import { Config, loadConfig } from './src/utils/config';
import admin = require('firebase-admin');

const PORT = Number(process.env.PORT) || 8080;

export const init = async (): Promise<express.Express> => {

  // Load config
  loadConfig();

  // Init firebase admin
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: Config.productId,
      clientEmail: Config.clientEmail,
      privateKey: Config.privateKey
    }),
    databaseURL: Config.storageBucket,
  });

  await initMongo()

  const app = express();
  app.use(express.json({ limit: '150mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cors())

  app.get('/', (res, req) => {
    req.json({ status: 'ok' })
  });

  app.use('/api', routes);

  app.use('/docs', express.static('docs'))

  app.listen(PORT, () => {
    logger.info(`App listening on port ${PORT}`);
  });

  return app;

}

export const isTestMode = (): boolean => {
  return !!process.env.TEST_MODE;
}

if (!isTestMode()) {
  init();
}