import { IQueryHandler } from '@/share/interface';
import { ErrDataNotFound } from '@/share/model/base-error';
import { ModelStatus } from '@/share/model/base-model';
import { GetDetailQuery, IBrandRepository } from '../interface';
import { Brand } from '../model/brand';

export class GetDetailBrandQueryHandler implements IQueryHandler<GetDetailQuery, Brand> {
  constructor(private readonly brandRepository: IBrandRepository) {}

  async query(query: GetDetailQuery): Promise<Brand> {
    const brand = await this.brandRepository.get(query.id);
    if (!brand || brand.status === ModelStatus.DELETED) {
      throw ErrDataNotFound;
    }

    return brand;
  }
}
