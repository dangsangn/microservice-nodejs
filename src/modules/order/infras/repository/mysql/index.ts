import { IOrderCommandRepository } from '@/modules/order/interface';
import { Order, OrderUpdateDTO } from '@/modules/order/model';
import { Sequelize } from 'sequelize';
import { OrderItemPersistence, OrderPersistence } from './dto';

export class OrderCommandRepository implements IOrderCommandRepository {
  constructor(readonly sequelize: Sequelize) {}

  async insert(data: Order): Promise<void> {
    await this.sequelize.transaction(async (t) => {
      await OrderPersistence.create(data, { transaction: t });
      await OrderItemPersistence.bulkCreate(data.items, { transaction: t });
      return;
    });
  }

  update(id: string, data: OrderUpdateDTO): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  delete(id: string, isHard: boolean): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
