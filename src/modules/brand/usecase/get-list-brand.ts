import { IQueryHandler } from '@/share/interface';
import { IBrandRepository, ListQuery } from '../interface';
import { Brand } from '../model/brand';

export class GetListBrandQueryHandler implements IQueryHandler<ListQuery, Brand[]> {
  constructor(private readonly brandRepository: IBrandRepository) {}

  async query(query: ListQuery): Promise<Brand[]> {
    const { condition, paging } = query;
    const brands = await this.brandRepository.list(condition, paging);
    return brands;
  }
}
