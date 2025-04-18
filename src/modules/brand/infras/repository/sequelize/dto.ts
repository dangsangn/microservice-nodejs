import { DataTypes, Model, Sequelize } from 'sequelize';

export const modelName = 'Brand';

export class BrandPersistence extends Model {}

export const init = (sequelize: Sequelize) => {
  BrandPersistence.init(
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
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      tagLine: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'tag_line',
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'deleted'),
        allowNull: true,
        defaultValue: 'active',
      },
    },
    {
      sequelize,
      modelName: modelName,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      tableName: 'brands',
    },
  );
};
