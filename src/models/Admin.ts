// src/models/Admin.ts
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';

interface AdminAttributes {
  id: number;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

interface AdminCreationAttributes
  extends Optional<AdminAttributes, 'id' | 'created_at' | 'updated_at'> {}

export class Admin
  extends Model<AdminAttributes, AdminCreationAttributes>
  implements AdminAttributes
{
  public id!: number;
  public email!: string;
  public password_hash!: string;
  public created_at!: Date;
  public updated_at!: Date;
}

Admin.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    password_hash: { type: DataTypes.STRING(255), allowNull: false },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    tableName: 'admins',
    timestamps: false,
  }
);
