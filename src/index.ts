import express from 'express';
import requireAuth from './middleware/authMiddleware';
import { people } from './objects/Tree';
import cors from 'cors';
import { BambooService } from './services/bamboo.service';
import { getBambooApiKey } from './services/ssm.service';

async function startServer() {
  const app = express();
  const bambooAiKey = await getBambooApiKey();
  const bambooService = new BambooService(bambooAiKey);

  // Don't forget to uncomment:
  // app.use(requireAuth);
  app.use(
    cors({
      origin: '*',
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Amz-Date',
        'X-Amz-Security-Token',
        'X-Api-Key',
      ],
    }),
  );

  //Using the requireAuth middleware, we can protect our routes from unauthorized access.
  app.get('/trees', async (req, res) => {
    res.send({ employees: people });
  });

  app.get('/version', async (req, res) => {
    res.send('1.0.0');
  });

  app.get('/testBamboo', async (req, res) => {
    // console.log(await bambooService.getBambooCustomReport());
    // console.log(await bambooService.getBambooDirectory());
    bambooService.generateEmailToTreeMap(
      (await bambooService.getBambooDirectory()) as object[],
    );
    res.send('1.0.0');
  });

  app.use('/:invalidPath', (req, res) => {
    res.status(404).send('404 Not Found');
  });

  const port = process.env.PORT || 4000;

  app.listen(port, () => console.log(`App listening on PORT ${port}`));
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
