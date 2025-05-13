import express, { NextFunction, Request, Response } from 'express';
import { config } from 'dotenv';
import { sequelize } from '@/share/component/sequelize';
import { setupCategoryHexagonal } from '@/modules/category';
import { setupBrandHexagonal } from '@/modules/brand';
import { setupProductHexagonal } from './modules/product';
import morgan from 'morgan';
import { responseErr } from './share/app-error';
import { setupUserHexagon } from './modules/user';
import { TokenIntrospectRPCClient } from './share/repository/verify-token.rpc';
import { authMiddleware } from './share/middleware/auth';
import { allowRoles } from './share/middleware/check-role';
import { Requester, UserRole } from './share/interface';
import { setupMiddlewares } from './share/middleware';

config();

(async () => {
  await sequelize.authenticate();

  const port = process.env.PORT || 3333;
  const app = express();
  app.use(express.json());
  app.use(morgan('dev'));

  const introspect = new TokenIntrospectRPCClient(
    process.env.VERIFY_TOKEN_URL || 'http://localhost:3000/v1/rpc/introspect',
  );
  const authMdl = authMiddleware(introspect);
  const sctx = { mdlFactory: setupMiddlewares(introspect) };

  app.get('/v1/protected', authMdl, allowRoles([UserRole.ADMIN]), (req: Request, res: Response) => {
    const requester = res.locals.requester as Requester;
    res.status(200).json({ data: requester });
  });

  const myMiddleware = (req: Request, res: Response, next: NextFunction) => {
    console.log('Url: ', req.url);
    next();
  };

  app.use(myMiddleware);

  app.get('/', (req: Request, res: Response) => {
    res.send('Hello Microservice!');
  });

  app.use('/api/v1/categories', setupCategoryHexagonal(sequelize));
  app.use('/api/v1/brands', setupBrandHexagonal(sequelize));
  app.use('/api/v1/products', setupProductHexagonal(sequelize));
  app.use('/api/v1/users', setupUserHexagon(sequelize, sctx));

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    responseErr(err, res);
    return next();
  });

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
})();
