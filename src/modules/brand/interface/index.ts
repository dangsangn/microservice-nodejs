import { PagingDTO } from '@/share/model/paging';
import { Brand } from '../model/brand';
import { BrandConditionDTO, BrandCreateDTO, BrandUpdateDTO } from '../model/dto';
import { IRepository } from '@/share/interface';

export interface IBrandUseCase {
  create(data: BrandCreateDTO): Promise<string>;
  getDetail(id: string): Promise<Brand | null>;
  update(id: string, data: BrandUpdateDTO): Promise<boolean>;
  delete(id: string): Promise<boolean>;
  list(condition: BrandConditionDTO, paging: PagingDTO): Promise<Brand[]>;
}

export interface CreateCommand {
  dto: BrandCreateDTO;
}

export interface GetDetailQuery {
  id: string;
}

export interface UpdateCommand {
  id: string;
  dto: BrandUpdateDTO;
}

export interface DeleteCommand {
  id: string;
  isHardDelete?: boolean;
}

export interface ListQuery {
  condition: BrandConditionDTO;
  paging: PagingDTO;
}

export interface IBrandRepository extends IRepository<Brand, BrandConditionDTO, BrandUpdateDTO> {}
