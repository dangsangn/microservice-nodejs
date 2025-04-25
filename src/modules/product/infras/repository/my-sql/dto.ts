import { ProductGender } from '@/modules/product/model/product';
import { ModelStatus } from '@/share/model/base-model';
import { DataTypes, Model, Sequelize } from 'sequelize';

export class CategoryPersistence extends Model {}

export const modelName = 'Product';

export const init = (sequelize: Sequelize) => {
  CategoryPersistence.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      images: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      salePrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        field: 'sale_price',
        defaultValue: 0,
      },
      colors: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'deleted'),
        allowNull: false,
        defaultValue: ModelStatus.ACTIVE,
      },
      gender: {
        type: DataTypes.ENUM('male', 'female', 'unisex'),
        allowNull: false,
        defaultValue: ProductGender.UNISEX,
      },
      saleCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'sale_count',
      },
      brandId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'brand_id',
      },
      categoryId: {
        type: DataTypes.UUID,
        field: 'category_id',
      },
    },
    {
      sequelize,
      modelName: modelName,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      tableName: 'products',
    },
  );
};
