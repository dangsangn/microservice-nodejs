import { DataTypes, Model, Sequelize } from 'sequelize';

export class CategoryPersistence extends Model {}

export const modelName = 'Category';

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
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      parentId: {
        type: DataTypes.STRING,
        field: 'parent_id',
        allowNull: true,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'deleted'),
        allowNull: false,
        defaultValue: 'active',
      },
    },
    {
      sequelize,
      modelName: modelName,
      timestamps: true,
      createdAt: 'create_at',
      updatedAt: 'update_at',
      tableName: 'categories',
    },
  );
};
