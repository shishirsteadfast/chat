// src/models/PasswordResetToken.ts
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';
import { Admin } from './Admin';

interface PasswordResetTokenAttributes {
  id: number;
  admin_id: number;
  token: string;
  expires_at: Date;
  used: boolean;
}

interface PasswordResetTokenCreationAttributes
  extends Optional<PasswordResetTokenAttributes, 'id' | 'used'> {}

export class PasswordResetToken
  extends Model<PasswordResetTokenAttributes, PasswordResetTokenCreationAttributes>
  implements PasswordResetTokenAttributes
{
  public id!: number;
  public admin_id!: number;
  public token!: string;
  public expires_at!: Date;
  public used!: boolean;
}

PasswordResetToken.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    admin_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    token: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    expires_at: { type: DataTypes.DATE, allowNull: false },
    used: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  },
  {
    sequelize,
    tableName: 'password_reset_tokens',
    timestamps: false,
  }
);

Admin.hasMany(PasswordResetToken, { foreignKey: 'admin_id' });
PasswordResetToken.belongsTo(Admin, { foreignKey: 'admin_id' });
