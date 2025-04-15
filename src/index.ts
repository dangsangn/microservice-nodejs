import express, { Request, Response } from 'express';
import { config } from 'dotenv';
import { sequelize } from './share/component/sequelize';

config();

(async () => {
  await sequelize.authenticate();

  const port = process.env.PORT || 3333;
  const app = express();
  app.use(express.json());

   app.get('/', (req: Request, res: Response) => {
     res.send('Hello Microservice!');
   });

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
})();
