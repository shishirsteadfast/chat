// src/models/User.ts
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';

export interface UserAttributes {
  id: number;
  external_id: string;
  display_name: string | null;
  created_at: Date;
}

export interface UserCreationAttributes
  extends Optional<UserAttributes, 'id' | 'display_name' | 'created_at'> {}

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public external_id!: string;
  public display_name!: string | null;
  public created_at!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    external_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    display_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: false,
  }
);
