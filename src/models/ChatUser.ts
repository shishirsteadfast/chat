// src/models/ChatUser.ts
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';
import { Project } from './Project';

interface ChatUserAttributes {
  id: number;
  project_id: number;
  external_id: string;
  display_name: string | null;
  created_at: Date;
}

interface ChatUserCreationAttributes
  extends Optional<ChatUserAttributes, 'id' | 'display_name' | 'created_at'> {}

export class ChatUser
  extends Model<ChatUserAttributes, ChatUserCreationAttributes>
  implements ChatUserAttributes
{
  public id!: number;
  public project_id!: number;
  public external_id!: string;
  public display_name!: string | null;
  public created_at!: Date;
}

ChatUser.init(
  {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    project_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    external_id: { type: DataTypes.STRING(255), allowNull: false },
    display_name: { type: DataTypes.STRING(255), allowNull: true },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    tableName: 'chat_users',
    timestamps: false,
    indexes: [
      { unique: true, fields: ['project_id', 'external_id'] },
    ],
  }
);

Project.hasMany(ChatUser, { foreignKey: 'project_id' });
ChatUser.belongsTo(Project, { foreignKey: 'project_id' });
