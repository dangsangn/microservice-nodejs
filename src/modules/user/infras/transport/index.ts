import { IUserUseCase } from '@/modules/user/interface';
import { User, UserConditionDTO, UserRegisterDTO, UserUpdateDTO } from '@/modules/user/model';
import { jwtService } from '@/share/component/jwt';
import { BaseHttpService } from '@/share/transport';
import { Request, Response } from 'express';

export class UserHTTPService extends BaseHttpService<User, UserRegisterDTO, UserUpdateDTO, UserConditionDTO> {
  constructor(readonly useCase: IUserUseCase) {
    super(useCase);
  }

  async registerAPI(req: Request, res: Response) {
    await this.createApi(req, res);
  }

  async loginAPI(req: Request, res: Response) {
    const token = await this.useCase.login(req.body);
    res.status(200).json({ data: token });
  }

  async profileAPI(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const payload = await jwtService.verifyToken(token);

      if (!payload) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { sub } = payload;

      const user = await this.useCase.profile(sub);

      const { salt, password, ...otherProps } = user;
      res.status(200).json({ data: otherProps });
    } catch (error) {
      res.status(400).json({
        message: (error as Error).message,
      });
    }
  }

  async introspectAPI(req: Request, res: Response) {
    console.log('1111');
    try {
      const { token } = req.body;
      const result = await this.useCase.verifyToken(token);
      res.status(200).json({ data: result });
    } catch (error) {
      res.status(400).json({
        message: (error as Error).message,
      });
    }
  }
}
