// src/models/Message.ts
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';
import { Conversation } from './Conversation';
import { ProjectUser } from './ProjectUser';

export interface MessageAttributes {
  id: number;
  conversation_id: number;
  project_user_id: number;
  content: string;
  metadata: object | null;
  created_at: Date;
}

export interface MessageCreationAttributes
  extends Optional<MessageAttributes, 'id' | 'metadata' | 'created_at'> {}

export class Message
  extends Model<MessageAttributes, MessageCreationAttributes>
  implements MessageAttributes
{
  public id!: number;
  public conversation_id!: number;
  public project_user_id!: number;
  public content!: string;
  public metadata!: object | null;
  public created_at!: Date;
}

Message.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    conversation_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    project_user_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    metadata: {
      type: DataTypes.JSON,
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
    tableName: 'messages',
    timestamps: false,
    indexes: [
      {
        fields: ['conversation_id', 'created_at'],
      },
    ],
  }
);

Conversation.hasMany(Message, { foreignKey: 'conversation_id' });
Message.belongsTo(Conversation, { foreignKey: 'conversation_id' });

ProjectUser.hasMany(Message, { foreignKey: 'project_user_id' });
Message.belongsTo(ProjectUser, { foreignKey: 'project_user_id' });
