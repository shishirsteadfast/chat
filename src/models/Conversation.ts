import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';
import { Project } from './Project';

export type ConversationType = 'direct' | 'group' | 'system';

export interface ConversationAttributes {
  id: number;
  project_id: number;
  title: string | null;
  type: ConversationType;
  created_at: Date;
  updated_at: Date;
}

export interface ConversationCreationAttributes
  extends Optional<
    ConversationAttributes,
    'id' | 'title' | 'type' | 'created_at' | 'updated_at'
  > {}

export class Conversation
  extends Model<ConversationAttributes, ConversationCreationAttributes>
  implements ConversationAttributes
{
  public id!: number;
  public project_id!: number;
  public title!: string | null;
  public type!: ConversationType;
  public created_at!: Date;
  public updated_at!: Date;
}

Conversation.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    project_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM('direct', 'group', 'system'),
      allowNull: false,
      defaultValue: 'direct',
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'conversations',
    timestamps: false,
  }
);

Project.hasMany(Conversation, { foreignKey: 'project_id' });
Conversation.belongsTo(Project, { foreignKey: 'project_id' });
