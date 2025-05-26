import { Request, Response } from 'express';
import { IUseCase } from '../interface';
import { PagingDTOSchema } from '../model/paging';

export class BaseHttpService<CreateDTO, UpdateDTO, Condition, Entity> {
  constructor(readonly useCase: IUseCase<CreateDTO, UpdateDTO, Condition, Entity>) {}

  async createApi(req: Request, res: Response) {
    const id = await this.useCase.create(req.body);
    res.status(201).json({ data: id });
  }

  async updateApi(req: Request, res: Response) {
    await this.useCase.update(req.params.id, req.body);
    res.status(200).json({ data: true });
  }

  async deleteApi(req: Request, res: Response) {
    await this.useCase.delete(req.params.id);
    res.status(200).json({ data: true });
  }

  async getDetailApi(req: Request, res: Response) {
    const entity = await this.useCase.get(req.params.id);
    res.status(200).json({ data: entity });
  }

  async listApi(req: Request, res: Response) {
    const { success, data: paging, error } = PagingDTOSchema.safeParse(req.query);
    if (!success) {
      throw new Error(error.message);
    }
    const { page, limit, ...condition } = req.query;
    const entities = await this.useCase.list(condition as Condition, paging);
    res.status(200).json({ data: entities, paging, filter: condition });
  }
}
