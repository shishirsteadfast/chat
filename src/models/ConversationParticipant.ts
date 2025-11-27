// src/models/ConversationParticipant.ts
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';
import { Conversation } from './Conversation';
import { ProjectUser } from './ProjectUser';

export interface ConversationParticipantAttributes {
  id: number;
  conversation_id: number;
  project_user_id: number;
  created_at: Date;
}

export interface ConversationParticipantCreationAttributes
  extends Optional<ConversationParticipantAttributes, 'id' | 'created_at'> {}

export class ConversationParticipant
  extends Model<
    ConversationParticipantAttributes,
    ConversationParticipantCreationAttributes
  >
  implements ConversationParticipantAttributes
{
  public id!: number;
  public conversation_id!: number;
  public project_user_id!: number;
  public created_at!: Date;
}

ConversationParticipant.init(
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
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'conversation_participants',
    timestamps: false,
  }
);

Conversation.hasMany(ConversationParticipant, { foreignKey: 'conversation_id' });
ConversationParticipant.belongsTo(Conversation, { foreignKey: 'conversation_id' });

ProjectUser.hasMany(ConversationParticipant, { foreignKey: 'project_user_id' });
ConversationParticipant.belongsTo(ProjectUser, { foreignKey: 'project_user_id' });
