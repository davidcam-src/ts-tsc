import express from 'express';
import requireAuth from './middleware/authMiddleware';
import cors from 'cors';
import { BambooService } from './services/bamboo.service';
import { getBambooApiKey, getDataLakeClientId } from './services/ssm.service';
import { TreeList } from './objects/TreeList';

async function startServer() {
  const app = express();
  const bambooApiKey = await getBambooApiKey();
  const dataLakeClientId = await getDataLakeClientId();

  const bambooService = new BambooService(bambooApiKey);

  // Don't forget to uncomment:
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

  const allowOptionsRequests = (req, res, next) => {
    if (req.method === 'OPTIONS') {
      // Allow OPTIONS request to proceed
      res.sendStatus(200);
    } else {
      // For other requests, continue to the next middleware
      next();
    }
  };

  // Apply the middleware globally
  app.use(allowOptionsRequests);
  app.use(requireAuth);

  //Using the requireAuth middleware, we can protect our routes from unauthorized access.
  app.get('/trees', async (req, res) => {
    let treeList = new TreeList();
    await treeList.addBambooEmployeeList(bambooService);
    await treeList.addBambooCustomReport(bambooService);
    await treeList.addBambooPtoList(bambooService);
    treeList.updateTreesArray();
    // res.send(treeList.emailToTreeMap);
    res.send(treeList.treeListToJSON());
    // Removing static data response
    // res.send({ employees: people });
  });

  app.get('/version', async (req, res) => {
    res.send('1.0.0');
  });

  app.get('/testBamboo', async (req, res) => {
    // console.log(await bambooService.CustomReport());
    // console.log(await bambooService.getBambooDirectory());
    // bambooService.generateEmailToTreeMap(
    //   (await bambooService.getBambooDirectory()) as object[],
    // );
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
