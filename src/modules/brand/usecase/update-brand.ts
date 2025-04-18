import { ICommandHandler } from '@/share/interface';
import { IBrandRepository, UpdateCommand } from '../interface';
import { BrandUpdateDTOSchema } from '../model/dto';
import { ErrDataNotFound } from '@/share/model/base-error';

export class UpdateBrandCmdHandler implements ICommandHandler<UpdateCommand, boolean> {
  constructor(private readonly brandRepository: IBrandRepository) {}

  async execute(command: UpdateCommand): Promise<boolean> {
    const { data: parseData, error } = BrandUpdateDTOSchema.safeParse(command.dto);
    if (error) {
      throw new Error(error.message);
    }

    const brand = await this.brandRepository.findByCondition({ id: command.id });
    if (!brand) {
      throw ErrDataNotFound;
    }

    const updatedBrand = {
      ...brand,
      ...parseData,
      updatedAt: new Date(),
    };

    await this.brandRepository.update(command.id, updatedBrand);
    return true;
  }
}
