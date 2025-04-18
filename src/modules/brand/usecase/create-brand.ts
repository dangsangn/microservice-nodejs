import { ICommandHandler } from '@/share/interface';
import { ModelStatus } from '@/share/model/base-model';
import { v7 } from 'uuid';
import { CreateCommand, IBrandRepository } from '../interface';
import { BrandCreateDTOSchema } from '../model/dto';
import { ErrBrandAlreadyExists } from '../model/error';

export class CreateBrandCmdHandler implements ICommandHandler<CreateCommand, string> {
  constructor(private readonly brandRepository: IBrandRepository) {}

  async execute(command: CreateCommand): Promise<string> {
    const { data: parseData, error } = BrandCreateDTOSchema.safeParse(command.dto);
    if (error) {
      throw new Error(error.message);
    }

    const isExist = await this.brandRepository.findByCondition({
      name: parseData.name,
    });
    if (isExist) {
      throw ErrBrandAlreadyExists;
    }

    const newId = v7();
    const newBrand = {
      ...parseData,
      id: newId,
      status: ModelStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await this.brandRepository.insert(newBrand);
    return newId;
  }
}
