// src/models/Project.ts
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';

interface ProjectAttributes {
  id: number;
  name: string;
  api_key: string;
  created_at: Date;
}

interface ProjectCreationAttributes
  extends Optional<ProjectAttributes, 'id' | 'api_key' | 'created_at'> {}

export class Project
  extends Model<ProjectAttributes, ProjectCreationAttributes>
  implements ProjectAttributes
{
  public id!: number;
  public name!: string;
  public api_key!: string;
  public created_at!: Date;
}

Project.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING(255), allowNull: false },
    api_key: { type: DataTypes.STRING(64), allowNull: false, unique: true },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    tableName: 'projects',
    timestamps: false,
  }
);
