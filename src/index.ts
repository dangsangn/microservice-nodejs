import express, { Request, Response } from 'express';
import { config } from 'dotenv';
import { sequelize } from '@/share/component/sequelize';
import { setupCategoryHexagonal } from '@/modules/category';
import { setupBrandHexagonal } from '@/modules/brand';
import { setupProductHexagonal } from './modules/product';
config();

(async () => {
  await sequelize.authenticate();

  const port = process.env.PORT || 3333;
  const app = express();
  app.use(express.json());

  app.get('/', (req: Request, res: Response) => {
    res.send('Hello Microservice!');
  });

  app.use('/api/v1/categories', setupCategoryHexagonal(sequelize));
  app.use('/api/v1/brands', setupBrandHexagonal(sequelize));
  app.use('/api/v1/products', setupProductHexagonal(sequelize));

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
})();
