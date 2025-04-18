import { Response, Request } from 'express';
import {
  CreateBrandCmdHandler,
  DeleteBrandCmdHandler,
  GetDetailBrandQueryHandler,
  GetListBrandQueryHandler,
  UpdateBrandCmdHandler,
} from '../../usecase';
import { PagingDTOSchema } from '@/share/model/paging';

export class BrandHttpService {
  constructor(
    private readonly createBrandUseCase: CreateBrandCmdHandler,
    private readonly updateBrandUseCase: UpdateBrandCmdHandler,
    private readonly deleteBrandUseCase: DeleteBrandCmdHandler,
    private readonly getDetailBrandUseCase: GetDetailBrandQueryHandler,
    private readonly listBrandUseCase: GetListBrandQueryHandler,
  ) {}

  async createBrand(req: Request, res: Response) {
    try {
      const brandId = await this.createBrandUseCase.execute({ dto: req.body });
      res.status(201).json({ data: brandId });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  async updateBrand(req: Request, res: Response) {
    try {
      const result = await this.updateBrandUseCase.execute({ id: req.params.id, dto: req.body });
      res.status(200).json({ data: result });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  async deleteBrand(req: Request, res: Response) {
    try {
      const result = await this.deleteBrandUseCase.execute({ id: req.params.id });
      res.status(200).json({ data: result });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  async getDetailBrand(req: Request, res: Response) {
    try {
      const brand = await this.getDetailBrandUseCase.query({ id: req.params.id });
      res.status(200).json({ data: brand });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  async listBrand(req: Request, res: Response) {
    try {
      const { success, data: paging, error } = PagingDTOSchema.safeParse(req.query);
      if (!success) {
        throw new Error(error.message);
      }
      const { page, limit, ...condition } = req.query;

      const brand = await this.listBrandUseCase.query({ condition, paging });
      res.status(200).json({ data: brand, paging, filter: condition });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
}
