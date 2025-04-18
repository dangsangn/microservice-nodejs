import { ICommandHandler } from '@/share/interface';
import { ErrDataNotFound } from '@/share/model/base-error';
import { ModelStatus } from '@/share/model/base-model';
import { DeleteCommand, IBrandRepository } from '../interface';

export class DeleteBrandCmdHandler implements ICommandHandler<DeleteCommand, boolean> {
  constructor(private readonly brandRepository: IBrandRepository) {}

  async execute(command: DeleteCommand): Promise<boolean> {
    const { id, isHardDelete } = command;

    const brand = await this.brandRepository.findByCondition({ id });
    if (!brand) {
      throw ErrDataNotFound;
    }

    if (isHardDelete) {
      await this.brandRepository.delete(id);
    } else {
      await this.brandRepository.update(id, { status: ModelStatus.DELETED });
    }

    return true;
  }
}
